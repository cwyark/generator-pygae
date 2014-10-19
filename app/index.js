'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var gruntfile = require('gruntfile-editor');



var GAEFullstackGenerator = yeoman.generators.Base.extend({

  	initializing: function () {
    	this.pkg = require('../package.json');
		this.filters = {};
  	},
	
	info: function() {
		// Have Yeoman greet the user.
		this.log(yosay(
		  'Welcome to the GAE with Python Fullstack generator!'
		));
	},

  	python_prompts: function () {
    	var done = this.async();
		this.prompt([
		{
			type: 'input',
			name: 'app_id',
			message: 'What is your Google App Engine Application ID?',
			default: path.basename(process.cwd())
		}, {
			type: 'list',
			name: 'PyFramework',
			message: 'Which python framework do you want to use?',
			choices:['Flask','Webapp2','Bottle'],
			filter: function( val ) { return val.toLowerCase(); }
		},{
			type: 'input',
			name: 'gcloud_path',
			message: 'Where is your Google Cloud SDK path?(please use absolute path)',
			default: '${HOME}/.sdk_tools/google-cloud-sdk'
		},{
			type: 'confirm',
			name: 'virtualenv',
			message: 'Do you want to use virtualenv with your development project?',
			default: true
		}, {
			type: 'input',
			name: 'virtualenv_name',
			message: "What's your virtualenv name?",
			default: path.basename(process.cwd()),
			when: function(props){ return props.virtualenv;}
		}], function (props) {
			this.app_id 				= props.app_id;
			this.gcloud_path 			= props.gcloud_path;
			this.filters['pyframework'] = props.PyFramework;
			this.virtualenv  			= props.virtualenv;
			this.virtualenv_name 		= props.virtualenv_name;
			done();
		}.bind(this));
  	},

	ui_prompts: function () {
    	var done = this.async();
		this.prompt([
		{
			type: 'confirm',
			name: 'Compass',
			message: 'Do you want to use Compass?',
			default: false
		}, {
			type: 'list',
			name: 'ui_framework',
			message: 'Which UI framework do you want to use?',
			choices: ['bootstrap', 'Foundation', 'Semantic', 'None'],
			filter: function( val ) { return val.toLowerCase(); }
		}], function (props) {
			this.filters['uiframework'] = props.ui_framework;
			this.compass   				= props.compass;
			done();
		}.bind(this));
  	},

  writing: {
    app: function () {
      this.dest.mkdir('app');
      this.dest.mkdir('lib');
	  this.src.copy('appengine_config.py','appengine_config.py');
	  this.src.copy('Gruntfile.js','Gruntfile.js');
	  this.src.copy('pyweb/' + this.filters['pyframework'] + '_entry.py','app/__init__.py');

	  this.template('_app.yaml', 'app.yaml');
	  /* pip's requirements config */
	  this.template('_requirements.txt', 'requirements.txt');
	  this.template('_main.py', 'main.py');
      this.template('_package.json', 'package.json');
	  this.template('_bower.json', 'bower.json');
    },

    projectfiles: function () {
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('jshintrc', '.jshintrc');
    }
  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = GAEFullstackGenerator;
