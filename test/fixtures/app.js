'use strict';
var flatiron = require('flatiron')
  , app = flatiron.app
  , path = require('path')
  , _base = path.join(__dirname, '/../..')

process.env.NODE_ENV = 'test'

require('chai').should()

app.use(flatiron.plugins.http, {})
app._base = _base
app.start()

module.exports = app
