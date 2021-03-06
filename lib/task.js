var util = require('./util')

/**
 * Represents an Task
 * @param {Object} modem docker-modem
 * @param {String} id    Task's ID
 */
var Task = function(modem, id, cookie) {
	this.modem = modem
	this.id = id
	this.cookie = cookie
	this.serverid = serverid

	this.defaultOptions = {
		log: {}
	}
}

Task.prototype[require('util').inspect.custom] = function() {
	return this
}

/**
 * Query Docker for Task details.
 *
 * @param {function} callback
 */
Task.prototype.inspect = function(callback, opts) {
	var self = this

	var optsf = {
		path: '/tasks/' + this.id,
		method: 'GET',
		statusCodes: {
			200: true,
			404: 'unknown task',
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
 * Task logs
 * @param  {Object}   opts     Logs options. (optional)
 * @param  {Function} callback Callback with data
 */
Task.prototype.logs = function(opts, callback) {
	var self = this
	var args = util.processArgs(opts, callback, this.defaultOptions.log)

	var optsf = {
		path: '/tasks/' + this.id + '/logs?',
		method: 'GET',
		isStream: args.opts.follow || false,
		statusCodes: {
			101: true,
			200: true,
			404: 'no such container',
			500: 'server error',
			503: 'node is not part of a swarm'
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

module.exports = Task
