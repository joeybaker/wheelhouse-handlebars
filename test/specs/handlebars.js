/*globals describe, it, before */
'use strict';
var app = require('../fixtures/app')
  , path = require('path')
  , handlebarsPlugin = require(path.join(app._base, 'lib/handlebars.js'))

describe('HandlebarsPlugin', function(){
  before(function(done){
    app.options.log = {console: {silent: true}}
    app.use(handlebarsPlugin, {
      templates: path.join(app._base, 'test/fixtures/templates')
      , helpers: path.join(app._base, 'test/fixtures/helpers')
    })
    app.start(null, done)
  })

  it('attaches to a flatiron app', function(){
    handlebarsPlugin.should.exist
    app.render.should.be.a('function')
  })
  it('finds templates', function(done){
    app.parseTemplates(function(){
      app.templates.should.be.a('object')
      app.templates.layout.should.exist
      done()
    })
  })

  describe('helpers', function(){
    it('loads additional helpers', function(){
      app.render('aliens', {aliens: ['Kevin Spacey']}).indexOf('is invading').should.not.equal(-1)
    })
    it('loads built in helpers', function(){
      app.render('keyValue', {mayors: {'key': 'city', 'a bigger key': 'city2'}}).indexOf('Has a').should.not.equal(-1)
    })
  })

  describe('#render', function(){
    it('outputs the layout handlebars file', function(){
      var layout = app.render()
      layout.should.be.a('string')
      layout.indexOf('<!DOCTYPE html>').should.equal(0)
      layout.indexOf('</html>').should.equal(layout.length - 8)
    })
    it('yields a template in the layout', function(){
      app.render('hello').indexOf('hello').should.not.equal(-1)
    })
    it('prints the title tag', function(){
      app.render().indexOf('<title>wheelhouse').should.not.equal(-1)
    })
    it('prints meta tags', function(){
      var metaString = 'google sees me'
      app.render(null, null, {meta: {description: metaString}}).indexOf(metaString).should.not.equal(-1)
    })

    it('throws an error if the template is missing', function(){
        app.render.bind(null, 'templateThatIsMissing', null, null).should.throw(Error)
    })
  })
})

