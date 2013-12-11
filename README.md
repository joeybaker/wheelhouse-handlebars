wheelhouse-handlebars
=======================

[![NPM](https://nodei.co/npm/wheelhouse-handlebars.png)](https://nodei.co/npm/wheelhouse-handlebars/)

A wheelhouse package for rendering handlebars templates with [flatiron](https://github.com/flatiron/flatiron).

## Usage

### Setup
```js
var flatiron = require('flatiron')
  , app = flatiron.app
  , handlebarsPlugin = require('wheelhouse-handlebars')

app.use(flatiron.plugins.http, {})

app.use(handlebarsPlugin, {
  templates: '/full/path/to/handlebars/templates' // required. Absolute path.
  , helpers: '/full/path/to/handlebars/helpers' // optional, if you have handlebars helpers, this is where you load them. Can be an array or a string.
  , layout: 'layout' // optional, the name of the main layout file. Can be a path relative to your templates directory.
  , extension: 'hbs' // optional, the extension name for you handlebars templates. Don't prefix with a dot.
})

app.start(8999)
```

### rendering

`app.render('template/name', data, options)`

```js

app.router.on('get', 'some/path', function(){
  this.res.end(app.render('home', {hello: 'world'}, {
    title: 'Hello World'
    , meta: {description: 'Sup there Googs?'}
    , myLayoutVar: 'an optional value that defined in your layout template'
  }))
})

```

### Layout config options

The main layout files (`layout.hbs` by default), gets a few variables passed to it
which you should include in your layout.

You can look in `test/fixtures/templates/layout.hbs` for an example of a layout file.

#### {{_yield}}
This is the spot in your layout where the templates will be rendered. Same as say… Rails.

### {{_development}}
Boolean. Are you in an development environment? Useful if you have scripts or somesuch that you only want in your HTML in development.

#### {{title}}
You can pass this in as an option the the render function to set the title attribute
of page.

#### {{meta}}
Also an optional parameter that can be passed into the `render` method. Should be an object. e.g. `{meta: {description: 'A meta description for my page!'}}`

* The main layout for your site should be in a file called `layout.hbs`

### template parsing
Templates are parsed when you call `app.start()`, which means that making a change to a template will not be recognized by the server until you restart it.

This is desired behavior in production, but in development it can be a pain, so…  there's a way around that!

```js
app.parseTemplates(function(){
  // do something else now that templates have been reparsed.
})
```

### Creating a new helper
```js

var Handlebars = require('handlebars')
// define your helper function
function helper(context) {
  return 'hello! ' + context.msg
}

// export a function that accepts a handlebars instance
module.exports = function(handlebars){
  // if we haven't been given a handlebars instance, use the one we required. This will work fine browser-side, but not in node, you must pass the handlebars instance you want to attach to (this plugin does that for you.)
  handlebars || (handlebars = Handlebars)
  return handlebars.registerHelper('hello', helper)
}

```

## tests

### The grunt way
You must have [grunt-cli](https://github.com/gruntjs/grunt-cli) installed:
* `sudo npm i -g grunt-cli`
* `npm test`

### The Mocha way
`mocha test/specs -ui bdd`

## Changelog
### 0.3.5
* typo in last release notes

### 0.3.4
* If the requested template isn't cached, throw an error
* Updated lodash and misc dev dependencies

### 0.3.2
* **Breaking change**: helpers must now return a function that accepts a single argument: the `Handlebars` instances you want to attach the helper to. If you don't pass a handlebars instance, it will require handlebars and use that instance (works great client side)
