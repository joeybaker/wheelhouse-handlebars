'use strict';

var Handlebars = require('handlebars')

// Usage: {{#key_value obj}} Key: {{key}} // Value: {{value}} {{/key_value}}
//
// Iterate over an object, setting 'key' and 'value' for each property in
// the object.
// via https://gist.github.com/strathmeyer/1371586
Handlebars.registerHelper('eachKeys', function(context, options) {
  var buffer = ''
    , key

  for (key in context) {
    if (context.hasOwnProperty(key)) {
      buffer += options.fn({key: key, value: context[key]})
    }
  }

  return buffer
})

module.exports = Handlebars
