/*
  Inspired by: https://github.com/meltmedia/notconf/blob/master/lib/plugins/handlebars.js
*/
'use strict';
// var index = require('./' + grunt.template.process('<%= handlebars.compile.files[0].dest %>') + 'home.js')
//   , file = req._parsedUrl.pathname.substring(1)
var walker = require('walker')
  , fs = require('fs')
  , path = require('path')
  , Handlebars = require('handlebars')
  , _ = require('lodash')
  , pkg = require('../package.json')
  , fs = require('fs')
  , templatePath
  , templates = {}
  , templateFiles = []
  , options
  , app

function parseTemplates(callback){
  walker(templatePath)
    .on('file', function(file){
      templateFiles.push(file)
    })
    .on('end', function(){
      var done = _.after(templateFiles.length, function(){
          app.templates = templates
          app.log.debug('templates rendered')
          callback()
        })

      _.each(templateFiles, function(file){
        fs.readFile(file, {encoding: 'utf-8'}, function(err, content){
          if (err) throw new Error(err)

          var name = file.replace(templatePath + '/', '').replace('.' + options.extension, '')
          if (path.basename(file).charAt(0) === '_') Handlebars.registerPartial(name.replace('_', ''), content)
          else templates[name] = Handlebars.compile(content)

          done()
        })
      })
    })
}

function render(path, context, opts){
  var data = _.defaults(opts || {}, {
    title: pkg.name
    , meta: {}
    , _yield: path ? templates[path](context || []) : null
    , _development: app.env === 'development'
    // , _data is undefined by default so that the template won't render it unless necessary
  })
  return templates.layout(data)
}

exports.name = 'handlebarsPlugin'
exports.init = function(done){
  var helperPaths = [path.join(__dirname, 'helpers')] // load in the bult-in helpers

  app = this

  options = _.defaults(app.options.handlebarsPlugin, {
    layout: 'layout'
    , extension: 'hbs'
  })


  // helpers can be either an array or a string
  if (options.helpers) {
    _.isArray(options.helpers)
      ? helperPaths = _.union(helperPaths, options.helpers)
      : helperPaths.push(options.helpers)
  }

  // require all the helpers
  helperPaths.forEach(function(helperPath){
    fs.readdirSync(helperPath).forEach(function(file){
      require(path.join(helperPath, file))
    })
  })

  // after we've parsed the templates, we're done
  parseTemplates(done)
}
exports.attach = function(opts){
  app = this
  app.render = render
  app.templates = templates
  app.parseTemplates = parseTemplates

  templatePath = opts.templates || app.config.get('assets').templates
  if (!templatePath) throw new Error('Handlebars Plugin needs a template directory. Either set one in options, with `templates: <path>` or set in the config.json file with `renders.templates`')
}
