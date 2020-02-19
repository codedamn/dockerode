var util = require('./util')

/**
 * Represents a volume
 * @param {Object} modem docker-modem
 * @param {String} name  Volume's name
 */
var Volume = function(modem, name, cookie) {
	this.modem = modem
	this.name = name
	this.cookie = cookie
	this.serverid = serverid
}

Volume.prototype[require('util').inspect.custom] = function() {
	return this
}

/**
 * Inspect
 * @param  {Function} callback Callback, if specified Docker will be queried.
 * @return {Object}            Name only if callback isn't specified.
 */
Volume.prototype.inspect = function(callback, opts) {
	var self = this

	var optsf = {
		path: '/volumes/' + this.name,
		method: 'GET',
		statusCodes: {
			200: true,
			404: 'no such volume',
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
 * Removes the volume
 * @param  {[Object]}   opts     Remove options (optional)
 * @param  {Function} callback Callback
 */
Volume.prototype.remove = function(opts, callback) {
	var self = this
	var args = util.processArgs(opts, callback)

	var optsf = {
		path: '/volumes/' + this.name,
		method: 'DELETE',
		statusCodes: {
			204: true,
			404: 'no such volume',
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

module.exports = Volume
