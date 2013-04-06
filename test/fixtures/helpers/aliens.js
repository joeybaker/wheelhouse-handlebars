'use strict';

var Handlebars = require('handlebars')

Handlebars.registerHelper('aliens', function(context) {
  var out = ''
  context.forEach(function(alien){
    out += ' '
    out += alien
    out += ' is invading!!'
  })
  return out
})

module.exports = Handlebars
