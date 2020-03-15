/*!
 * response-time
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies
 * @api private
 */

var deprecate = require('depd')('response-time')
var onHeaders = require('on-headers')

/**
 * Module exports
 */

module.exports = responseTime

/**
 * Reponse time:
 *
 * Adds the `X-Response-Time` header displaying the response
 * duration in milliseconds.
 *
 * @param {object} [options]
 * @param {number} [options.digits=3]
 * @return {function}
 * @api public
 */

function responseTime (options) {
  var opts = options || {}

  if (typeof options === 'number') {
    // back-compat single number argument
    deprecate('number argument: use {digits: ' + JSON.stringify(options) + '} instead')
    opts = { digits: options }
  }

  // get the function to invoke
  var fn = typeof opts !== 'function'
    ? createSetHeader(opts)
    : opts

  return function responseTime (req, res, next) {
    var startAt = process.hrtime()

    onHeaders(res, function onHeaders () {
      var diff = process.hrtime(startAt)
      var time = diff[0] * 1e3 + diff[1] * 1e-6

      fn(req, res, time)
    })

    next()
  }
}

/**
 * Create function to set respoonse time header.
 * @api private
 */

function createSetHeader (options) {
  // response time digits
  var digits = options.digits !== undefined
    ? options.digits
    : 3

  // header name
  var header = options.header || 'X-Response-Time'

  // display suffix
  var suffix = options.suffix !== undefined
    ? Boolean(options.suffix)
    : true

  return function setResponseHeader (req, res, time) {
    if (res.getHeader(header)) {
      return
    }

    var val = time.toFixed(digits)

    if (suffix) {
      val += 'ms'
    }

    res.setHeader(header, val)
  }
}
