# response-time

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Gratipay][gratipay-image]][gratipay-url]

Response time for Node.js servers.

This module creates a middleware that records the response time for
requests in HTTP servers. The "response time" is defined here as the
elapsed time from when a request enters this middleware to when the
headers are written out to the client.

## Installation

```sh
$ npm install response-time
```

## API

```js
var responseTime = require('response-time')
```

### responseTime([options])

Create a middleware that adds a `X-Response-Time` header to responses. If
you don't want to use this module to automatically set a header, please
see the section about [`responseTime(fn)`](#responsetimeoptions).

#### Options

The `responseTime` function accepts an optional `options` object that may
contain any of the following keys:

##### digits

The fixed number of digits to include in the output, which is always in
milliseconds, defaults to `3` (ex: `2.300ms`).

##### header

The name of the header to set, defaults to `X-Response-Time`.

##### suffix

Boolean to indicate if units of measurement suffix should be added to
the output, defaults to `true` (ex: `2.300ms` vs `2.300`).

### responseTime(fn)

Create a new middleware that records the response time of a request and
makes this available to your own function `fn`. The `fn` argument will be
invoked as `fn(req, res, time)`, where `time` is a number in milliseconds.

## Examples

### express/connect

```js
var express = require('express')
var responseTime = require('response-time')

var app = express()

app.use(responseTime())

app.get('/', function (req, res) {
  res.send('hello, world!')
})
```

### vanilla http server

```js
var finalhandler = require('finalhandler')
var http = require('http')
var responseTime = require('response-time')

// create "middleware"
var _responseTime = responseTime()

http.createServer(function (req, res) {
  var done = finalhandler(req, res)
  _responseTime(req, res, function (err) {
    if (err) return done(err)

    // respond to request
    res.setHeader('content-type', 'text/plain')
    res.end('hello, world!')
  })
})
```

### response time metrics

```js
var express = require('express')
var responseTime = require('response-time')
var StatsD = require('node-statsd')

var app = express()
var stats = new StatsD()

stats.socket.on('error', function (error) {
  console.error(error.stack)
})

app.use(responseTime(function (req, res, time) {
  var stat = (req.method + req.url).toLowerCase()
    .replace(/[:\.]/g, '')
    .replace(/\//g, '_')
  stats.timing(stat, time)
}))

app.get('/', function (req, res) {
  res.send('hello, world!')
})
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/response-time.svg
[npm-url]: https://npmjs.org/package/response-time
[travis-image]: https://img.shields.io/travis/expressjs/response-time/master.svg
[travis-url]: https://travis-ci.org/expressjs/response-time
[coveralls-image]: https://img.shields.io/coveralls/expressjs/response-time/master.svg
[coveralls-url]: https://coveralls.io/r/expressjs/response-time?branch=master
[downloads-image]: https://img.shields.io/npm/dm/response-time.svg
[downloads-url]: https://npmjs.org/package/response-time
[gratipay-image]: https://img.shields.io/gratipay/dougwilson.svg
[gratipay-url]: https://www.gratipay.com/dougwilson/
