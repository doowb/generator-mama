'use strict';
var yeoman = require('yeoman-generator');
var util = require('util');
var path = require('path');
var _ = require('lodash');

var jokes = require('./jokes');

var joke = function(category) {
  var length = jokes[category].length;
  return 'Yo mama is so ' + category + jokes[category][Math.floor(Math.random()*length)];
};

var MamaGenerator = module.exports = function MamaGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

  this._.mixin({'joke':joke});
};

util.inherits(MamaGenerator, yeoman.generators.Base);

MamaGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var categoryPrompt = {
    type: 'list',
    name: 'category',
    message: 'Your mama is so',
    default: 'ugly',
    choices: ['ugly', 'fat', 'stupid', ' ...enough all ready!']
  };

  var tmpl = '<%= _.joke(category) %>';
  var jokePrompt = {
    name: 'joke',
    message: ''
  };

  var self = this;
  var ask = function () {
    self.prompt([categoryPrompt], function (props) {
      if(props.category !== ' ...enough all ready!') {
        jokePrompt.message = self._.template(tmpl, props);
        self.prompt([jokePrompt], function(nothing) {
          ask();
        });
      } else {
        cb();
      }
    });
  };

  ask();
};

MamaGenerator.prototype.fake = function() {
  this.copy('_package.json', 'package.json');
};