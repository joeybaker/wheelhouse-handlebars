'use strict';

var Handlebars = require('handlebars')

function jsonHelper(context) {
  return JSON.stringify(context)
}

module.exports = function(handlebars){
  handlebars || (handlebars = Handlebars)
  return handlebars.registerHelper('json', jsonHelper)
}
