'use strict';

var Handlebars = require('handlebars')

function alienHelper(context) {
  var out = ''
  context.forEach(function(alien){
    out += ' '
    out += alien
    out += ' is invading!!'
  })
  return out
}

module.exports = function(handlebars){
  handlebars || (handlebars = Handlebars)

  Handlebars.registerHelper('aliens', alienHelper)
}
