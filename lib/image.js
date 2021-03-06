var util = require('./util')

/**
 * Represents an image
 * @param {Object} modem docker-modem
 * @param {String} name  Image's name
 */
var Image = function(modem, name, cookie, serverid) {
	this.modem = modem
	this.name = name
	this.cookie = cookie
	this.serverid = serverid
}

Image.prototype[require('util').inspect.custom] = function() {
	return this
}

/**
 * Inspect
 * @param  {Function} callback Callback, if specified Docker will be queried.
 * @return {Object}            Name only if callback isn't specified.
 */
Image.prototype.inspect = function(callback, opts) {
	var self = this

	var optsf = {
		path: '/images/' + this.name + '/json',
		method: 'GET',
		statusCodes: {
			200: true,
			404: 'no such image',
			500: 'server error'
		}
	}

	if (callback === undefined) {
		return new this.modem.Promise(function(resolve, reject) {
			self.modem.dial(self.cookie, self.serverid, optsf, function(err, data, mybackend) {
				if (err) {
					return reject(err)
				}
				resolve(data)
			})
		})
	} else {
		this.modem.dial(self.cookie, self.serverid, optsf, function(err, data, mybackend) {
			if (err) return callback(err, data)
			callback(err, data)
		})
	}
}

/**
 * Distribution
 * @param {Object} opts
 * @param  {Function} callback Callback, if specified Docker will be queried.
 * @return {Object}            Name only if callback isn't specified.
 */
Image.prototype.distribution = function(opts, callback) {
	var args = util.processArgs(opts, callback)
	var self = this

	var optsf = {
		path: '/distribution/' + this.name + '/json',
		method: 'GET',
		statusCodes: {
			200: true,
			401: 'no such image',
			500: 'server error'
		},
		authconfig: args.opts ? args.opts.authconfig : undefined
	}

	if (args.callback === undefined) {
		return new this.modem.Promise(function(resolve, reject) {
			self.modem.dial(self.cookie, self.serverid, optsf, function(err, data, mybackend) {
				if (err) {
					return reject(err)
				}
				resolve(data)
			})
		})
	} else {
		this.modem.dial(self.cookie, self.serverid, optsf, function(err, data, mybackend) {
			if (err) return args.callback(err, data)
			args.callback(err, data)
		})
	}
}

/**
 * History
 * @param  {Function} callback Callback
 */
Image.prototype.history = function(callback, opts) {
	var self = this
	var optsf = {
		path: '/images/' + this.name + '/history',
		method: 'GET',
		statusCodes: {
			200: true,
			404: 'no such image',
			500: 'server error'
		}
	}

	if (callback === undefined) {
		return new this.modem.Promise(function(resolve, reject) {
			self.modem.dial(self.cookie, self.serverid, optsf, function(err, data, mybackend) {
				if (err) {
					return reject(err)
				}
				resolve(data)
			})
		})
	} else {
		this.modem.dial(self.cookie, self.serverid, optsf, function(err, data, mybackend) {
			if (err) return callback(err, data)
			callback(err, data)
		})
	}
}

/**
 * Get
 * @param  {Function} callback Callback with data stream.
 */
Image.prototype.get = function(callback, opts) {
	var self = this
	var optsf = {
		path: '/images/' + this.name + '/get',
		method: 'GET',
		isStream: true,
		statusCodes: {
			200: true,
			500: 'server error'
		}
	}

	if (callback === undefined) {
		return new this.modem.Promise(function(resolve, reject) {
			self.modem.dial(self.cookie, self.serverid, optsf, function(err, data, mybackend) {
				if (err) {
					return reject(err)
				}
				resolve(data)
			})
		})
	} else {
		this.modem.dial(self.cookie, self.serverid, optsf, function(err, data, mybackend) {
			if (err) return callback(err, data)
			callback(err, data)
		})
	}
}

/**
 * Push
 * @param  {Object}   opts     Push options, like 'registry' (optional)
 * @param  {Function} callback Callback with stream.
 * @param  {Object}   auth     Registry authentication
 */
Image.prototype.push = function(opts, callback, auth) {
	var self = this
	var args = util.processArgs(opts, callback)
	var isStream = true
	if (args.opts.stream === false) {
		isStream = false
	}
	var optsf = {
		path: '/images/' + this.name + '/push?',
		method: 'POST',
		options: args.opts,
		authconfig: args.opts.authconfig || auth,
		isStream: isStream,
		statusCodes: {
			200: true,
			404: 'no such image',
			500: 'server error'
		}
	}

	delete optsf.options.authconfig

	if (callback === undefined) {
		return new this.modem.Promise(function(resolve, reject) {
			self.modem.dial(self.cookie, self.serverid, optsf, function(err, data, mybackend) {
				if (err) {
					return reject(err)
				}
				resolve(data)
			})
		})
	} else {
		this.modem.dial(self.cookie, self.serverid, optsf, function(err, data, mybackend) {
			callback(err, data)
		})
	}
}

/**
 * Tag
 * @param  {Object}   opts     Tag options, like 'repo' (optional)
 * @param  {Function} callback Callback
 */
Image.prototype.tag = function(opts, callback) {
	var self = this
	var optsf = {
		path: '/images/' + this.name + '/tag?',
		method: 'POST',
		options: opts,
		statusCodes: {
			200: true, // unofficial, but proxies may return it
			201: true,
			400: 'bad parameter',
			404: 'no such image',
			409: 'conflict',
			500: 'server error'
		}
	}

	if (callback === undefined) {
		return new this.modem.Promise(function(resolve, reject) {
			self.modem.dial(self.cookie, self.serverid, optsf, function(err, data, mybackend) {
				if (err) {
					return reject(err)
				}
				resolve(data)
			})
		})
	} else {
		this.modem.dial(self.cookie, self.serverid, optsf, function(err, data, mybackend) {
			callback(err, data)
		})
	}
}

/**
 * Removes the image
 * @param  {[Object]}   opts     Remove options (optional)
 * @param  {Function} callback Callback
 */
Image.prototype.remove = function(opts, callback) {
	var self = this
	var args = util.processArgs(opts, callback)

	var optsf = {
		path: '/images/' + this.name + '?',
		method: 'DELETE',
		statusCodes: {
			200: true,
			404: 'no such image',
			409: 'conflict',
			500: 'server error'
		},
		options: args.opts
	}

	if (args.callback === undefined) {
		return new this.modem.Promise(function(resolve, reject) {
			self.modem.dial(self.cookie, self.serverid, optsf, function(err, data, mybackend) {
				if (err) {
					return reject(err)
				}
				resolve(data)
			})
		})
	} else {
		this.modem.dial(self.cookie, self.serverid, optsf, function(err, data, mybackend) {
			args.callback(err, data)
		})
	}
}

module.exports = Image
