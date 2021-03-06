/*
  Inspired by: https://github.com/meltmedia/notconf/blob/master/lib/plugins/handlebars.js
*/
'use strict';
var findit = require('findit')
  , fs = require('fs')
  , path = require('path')
  , Handlebars = require('handlebars')
  , _ = require('lodash')
  , pkg = require('../package.json')
  , fs = require('fs')
  , templatePath
  , templates = {}
  , options
  , app

function parseTemplates(callback){
  var find = findit(templatePath)
    , templateFileCount = 0
    , filesToGet = 0
    , done = function(){
      if (filesToGet !== 0) return

      app.templates = templates
      app.log.debug('templates rendered')
      if (_.isFunction(callback)) callback()
    }

  find.on('file', function(file){
      var r = new RegExp('.*' + options.extension + '$')
      if (!r.test(file)) return

      templateFileCount++

      fs.readFile(file, {encoding: 'utf-8'}, function(err, content){
        if (err) throw err

        var name = file.replace(templatePath + '/', '').replace('.' + options.extension, '')
        if (path.basename(file).charAt(0) === '_') Handlebars.registerPartial(name.replace('_', ''), '' + content)
        else templates[name] = Handlebars.compile('' + content)

        filesToGet--
        done()
      })
    })

  find.on('end', function(){
    filesToGet += templateFileCount
  })
}

function render(path, context, opts){
  var data
    , err
    , errMsg = path + ' template not found.'

  if (path && !templates[path]) {
    err = new Error(errMsg)
    app.log.error('handlebars: template not found: ' + path, {template: path, stack: err.stack.split('\n')})
    throw err
  }

  data = _.defaults(opts || {}, {
    title: pkg.name
    , meta: {}
    , _yield: path && templates[path] ? templates[path](context || []) : null
    , _development: app.env === 'development'
    // , _data is undefined by default so that the template won't render it unless necessary
  })

  return templates.layout(data)
}

exports.name = 'wheelhouse-handlebars'
exports.attach = function(opts){
  var helperPaths = [path.join(__dirname, 'helpers')] // load in the bult-in helpers

  app = this
  app.render = render
  app.templates = templates
  app.parseTemplates = parseTemplates

  options = _.defaults(opts, {
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
      require(path.join(helperPath, file))(Handlebars)
    })
  })

  templatePath = opts.templates || app.config.get('assets').templates
  if (!templatePath) throw 'Handlebars Plugin needs a template directory. Either set one in options, with `templates: <path>` or set in the config.json file with `renders.templates`'
}

exports.init = function(done){
  parseTemplates(done)
}
