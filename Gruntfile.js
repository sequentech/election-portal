/**
 * This file is part of agora-gui-elections.
 * Copyright (C) 2015-2016  Agora Voting SL <agora@agoravoting.com>

 * agora-gui-elections is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License.

 * agora-gui-elections  is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with agora-gui-elections.  If not, see <http://www.gnu.org/licenses/>.
**/

/*jslint node: true */
'use strict';

var pkg = require('./package.json');
var AV_CONFIG_VERSION = '5.1.0';

//Using exclusion patterns slows down Grunt significantly
//instead of creating a set of patterns like '**/*.js' and '!**/node_modules/**'
//this method is used to create a set of inclusive patterns for all subdirectories
//skipping node_modules, dist, and any .dirs
//This enables users to create any directory structure they desire.
var createFolderGlobs = function(fileTypePatterns) {
  fileTypePatterns = Array.isArray(fileTypePatterns) ? fileTypePatterns : [fileTypePatterns];
  var ignore = ['node_modules','dist','temp', 'env'];
  var fs = require('fs');
  return fs.readdirSync(process.cwd())
          .map(function(file){
            if (ignore.indexOf(file) !== -1 ||
                file.indexOf('.') === 0 ||
                !fs.lstatSync(file).isDirectory()) {
              return null;
            } else {
              return fileTypePatterns.map(function(pattern) {
                return file + '/**/' + pattern;
              });
            }
          })
          .filter(function(patterns){
            return patterns;
          })
          .concat(fileTypePatterns);
};

module.exports = function (grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // custom grunt task to check avConfig.js
  grunt.registerTask('check_config', function() {
    var fs = require('fs');
    var done = this.async();
    grunt.log.ok('Checking avConfig.js...');
    var conf = fs.readFile('avConfig.js', function(err, data) {
        if (err) {
            grunt.log.error('No avConfig.js file found');
            done(false);
        } else {
            var match = data.toString().match(/AV_CONFIG_VERSION = [\'\"]([\w\-\.]*)[\'\"];/);
            if (!match) {
                grunt.log.error('Invalid avConfig.js version');
            } else {
                var v = match[1];
                if (v === AV_CONFIG_VERSION) {
                    return done();
                } else {
                    grunt.log.error('Invalid avConfig.js version: ' + v);
                }
            }
            done(false);
        }
    });
  });

  // custom grunt task to check avPluginsConfig.js
  grunt.registerTask('check_plugins_config', function() {
    var fs = require('fs');
    var done = this.async();
    grunt.log.ok('Checking avPluginsConfig.js...');
    function checkAvPluginsConfig() {
        fs.readFile('avPluginsConfig.js', function(err, data) {
            if (err) {
                grunt.log.ok('No avPluginsConfig.js file found, creating...');
                var avPluginsConfigText = 
                    "var AV_PLUGINS_CONFIG_VERSION = '" + AV_CONFIG_VERSION + "';\n" +
                    "angular.module('avPluginsConfig', [])\n" +
                    "  .factory('PluginsConfigService', function() {\n" +
                    "    return {};\n" +
                    "  });\n" +
                    "\n" +
                    "angular.module('avPluginsConfig')\n" +
                    "  .provider('PluginsConfigService', function PluginsConfigServiceProvider() {\n" +
                    "    _.extend(this, {});\n" +
                    "\n" +
                    "    this.$get = [function PluginsConfigServiceProviderFactory() {\n" +
                    "    return new PluginsConfigServiceProvider();\n" +
                    "    }];\n" +
                    "   });";
                fs.writeFile("avPluginsConfig.js", 
                    avPluginsConfigText, 
                    function(err) {
                        if(err) {
                            grunt.log.error(
                                'Error creating avPluginsConfig.js file');
                            done(false);
                        } else {
                            grunt.log.ok('Created avPluginsConfig.js file, ' + 
                                'trying to read it again...');
                            checkAvPluginsConfig();
                        }
                }); 
            } else {
                var match = data.toString().match(
                    /AV_PLUGINS_CONFIG_VERSION = [\'\"]([\w\.\-]*)[\'\"];/);
                if (!match) {
                    grunt.log.error('Invalid avPluginsConfig.js version');
                } else {
                    var v = match[1];
                    if (v === AV_CONFIG_VERSION) {
                        return done();
                    } else {
                        grunt.log.error('Invalid avPluginsConfig.js version: ' +
                            v);
                    }
                }
                done(false);
            }
        });
    }
    var conf = checkAvPluginsConfig();
  });

  // Project configuration.
  grunt.initConfig({
    variables: {
      elections_html_body_include: ''
    },
    connect: {
      main: {
        options: {
          port: 9001
        }
      }
    },
    watch: {
      main: {
        options: {
            livereload: true,
            livereloadOnError: false,
            spawn: false
        },
        files: [createFolderGlobs(['*.js','*.less','*.html']),'!_SpecRunner.html','!.grunt'],
        tasks: [] //all the tasks are run dynamically during the watch event handler
      }
    },
    jshint: {
      main: {
        options: {
            jshintrc: '.jshintrc'
        },
        src: createFolderGlobs('*.js')
      }
    },
    clean: {
      before:{
        src:['dist','temp']
      },
      after: {
        src:['temp']
      }
    },
    less: {
      production: {
        options: {
        },
        files: [{
          expand: true,
          src: ['node_modules/agora-gui-common/themes/**/app.less', 'plugins/**/*.less'],
          dest: 'temp/',
          ext: '.css',
        }]
      }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')()
        ]
      },
      dist: {
        src: 'temp/node_modules/agora-gui-common/themes/**/app.css'
      }
    },
    ngtemplates: {
      main: {
        options: {
            module: pkg.name,
            htmlmin:'<%= htmlmin.main.options %>'
        },
        src: [createFolderGlobs('*.html'),'!index.html','!_SpecRunner.html'],
        dest: 'temp/templates.js'
      },
      common: {
        options: {
            module: pkg.name,
            htmlmin:'<%= htmlmin.main.options %>'
        },
        cwd: 'node_modules/agora-gui-common/',
        src: ["avRegistration/**/*.html", "avUi/**/*.html"],
        dest: 'temp/templates-common.js'
      }
    },
    copy: {
      temp: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/nanoscroller/bin/css/', 
            src: ['*'],
            dest: 'temp/node_modules/agora-gui-common/'
          },
          {
            expand: true,
            cwd: 'node_modules/intl-tel-input/build/css/', 
            src: ['*'],
            dest: 'temp/node_modules/agora-gui-common/'
          }
        ]
      },
      main: {
        files: [
          {src: ['img/**'], dest: 'dist/'},
          {src: ['img/**'], dest: 'dist/'},
          {src: ['temp_data/**'], dest: 'dist/'},
          {src: ['node_modules/agora-gui-common/dist/utils.js'], dest: 'dist/utils.js'},
          {src: ['node_modules/agora-gui-common/dist/intlTelInput.css'], dest: 'dist/intlTelInput.css'},
          {src: ['node_modules/agora-gui-common/dist/img/flags.png'], dest: 'dist/img/flags.png'},
          {
            expand: true,
            cwd:'node_modules/agora-gui-common/themes',
            src: ['**/*.png'],
            dest: 'dist/themes/',
            ext: '.png',
            extDot: 'first'
          },
          {
            expand: true,
            cwd: 'node_modules/bootstrap/fonts/',
            src: ['**'],
            dest: 'dist/themes/fonts/'
          },
          {
            expand: true,
            cwd: 'node_modules/bootstrap/fonts/',
            src: ['**'],
            dest: 'dist/themes/fonts/'
          },
          {
            expand: true,
            cwd: 'node_modules/font-awesome/fonts/',
            src: ['**'],
            dest: 'dist/fonts/'
          }
          //{src: ['node_modules/angular-ui-utils/ui-utils-ieshiv.min.js'], dest: 'dist/'},
          //{src: ['node_modules/select2/*.png','node_modules/select2/*.gif'], dest:'dist/css/',flatten:true,expand:true},
          //{src: ['node_modules/angular-mocks/angular-mocks.js'], dest: 'dist/'}
        ]
      }
    },
    dom_munger:{
      read: {
        options: {
          read:[
            {selector:'script[class="libnocompat"]',attribute:'src',writeto:'libnocompatjs'},
            {selector:'script[class="lib"]',attribute:'src',writeto:'libjs'},
            {selector:'script[class="app"]',attribute:'src',writeto:'appjs'},
            {selector:'link[rel="stylesheet"][data-concat!="false"]',attribute:'href',writeto:'appcss'}
          ]
        },
        src: 'index.html'
      },
      update: {
        options: {
          remove: ['script[data-remove!="false"]','link[data-remove!="false"]'],
          append: [
            {selector:'body',html:'<%= variables.elections_html_body_include %>'},
            {selector:'body',html:'<!--[if lte IE 8]><script src="/election/libcompat-v5.1.0.min.js"></script><![endif]--><!--[if gte IE 9]><script src="/election/libnocompat-v5.1.0.min.js"></script><![endif]--><!--[if !IE]><!--><script src="/election/libnocompat-v5.1.0.min.js"></script><!--<![endif]-->'},
            {selector:'body',html:'<!--All the source code of this program under copyright. Take a look at the license details at https://github.com/agoravoting/agora-core-view/blob/master/README.md -->'},
            {selector:'body',html:'<script src="/election/lib-v5.1.0.min.js"></script>'},
            {selector:'body',html:'<script src="/election/avConfig-v5.1.0.js"></script>'},
            {selector:'body',html:'<script src="/election/avThemes-v5.1.0.js"></script>'},
            {selector:'body',html:'<script src="/election/app-v5.1.0.min.js"></script>'},
            {selector:'body',html:'<script src="/election/avPlugins-v5.1.0.js"></script>'},
            {selector:'head',html:'<link rel="stylesheet" id="theme" data-base="/election/" href="/election/themes/default/app.min.css">'},
            {selector:'head',html:'<link rel="stylesheet" id="plugins" data-base="/election/" href="/election/plugins.css">'},
            {selector:'head',html:'<link rel="stylesheet" href="election/intlTelInput.css" />'}
          ]
        },
        src:'index.html',
        dest: 'dist/index.html'
      }
    },
    cssmin: {
      main: {
        files: [{
            expand: true,
            cwd:'temp/node_modules/agora-gui-common/themes',
            src: ['**/app.css'],
            dest: 'dist/themes/',
            ext: '.min.css',
            extDot: 'first'
        }]
      },
    },
    concat: {
      main: {
        files: {
          'dist/plugins.css': ['temp/plugins/**/*.css'],
          'temp/libcompat.js': [
            'vendor/jquery.compat/jquery-1.11.1.js',
            'vendor/json3/json-v3.3.2.js',
            'vendor/crypto/unsupportedBrowser.js'
          ],
          'temp/libnocompat.js': ['<%= dom_munger.data.libnocompatjs %>'],
          'temp/lib.js': ['<%= dom_munger.data.libjs %>'],
          'temp/app.js': ['<%= dom_munger.data.appjs %>','<%= ngtemplates.main.dest %>','<%= ngtemplates.common.dest %>'],
          'dist/avConfig-v5.1.0.js': ['avConfig.js'],
          'dist/avThemes-v5.1.0.js': ['node_modules/agora-gui-common/dist/avThemes-v5.1.0.js'],
          'dist/avPlugins-v5.1.0.js': [
            'avPluginsConfig.js',
            'plugins/**/*.js',
            '!plugins/**/*-spec.js'
          ]
        }
      }
    },
    "merge-json": {
      main: {
        files: {
            "dist/locales/en.json": [
              "locales/en.json", 
              "plugins/**/locales/en.json", 
              "node_modules/agora-gui-common/dist/locales/en.json"
            ],
            "dist/locales/es.json": [
              "locales/es.json", 
              "plugins/**/locales/es.json", 
              "node_modules/agora-gui-common/dist/locales/es.json"
            ],
            "dist/locales/gl.json": [
              "locales/gl.json", 
              "plugins/**/locales/gl.json", 
              "node_modules/agora-gui-common/dist/locales/gl.json"
            ],
            "dist/locales/ca.json": [
              "locales/ca.json", 
              "plugins/**/locales/ca.json", 
              "node_modules/agora-gui-common/dist/locales/ca.json"
            ],
            "dist/locales/nb.json": [
              "locales/nb.json", 
              "plugins/**/locales/nb.json", 
              "node_modules/agora-gui-common/dist/locales/nb.json"
            ],
            "dist/locales/sv.json": [
              "locales/sv.json", 
              "plugins/**/locales/sv.json", 
              "node_modules/agora-gui-common/dist/locales/sv.json"
            ],
            "dist/locales/fi.json": [
              "locales/fi.json", 
              "plugins/**/locales/fi.json", 
              "node_modules/agora-gui-common/dist/locales/fi.json"
            ]
        }
      }
    },
    ngAnnotate: {
      main: {
        files: {
        'temp/app.js':['temp/app.js'],
        'temp/lib.js': ['temp/lib.js'],
        'temp/libnocompat.js': ['temp/libnocompat.js'],
        'temp/libcompat.js': ['temp/libcompat.js']
        }
      }
    },
    uglify: {
      main: {
        options:{
          mangle: false,
          compress: {},
          beautify: true
        },
        files: {
          'dist/app-v5.1.0.min.js': 'temp/app.js',
          'dist/lib-v5.1.0.min.js': 'temp/lib.js',
          'dist/libnocompat-v5.1.0.min.js': 'temp/libnocompat.js',
          'dist/libcompat-v5.1.0.min.js': 'temp/libcompat.js',
          'dist/avWidgets.min.js': 'avWidgets.js',

          "dist/locales/moment/en.js": "node_modules/moment/locale/en-gb.js",
          "dist/locales/moment/es.js": "node_modules/moment/locale/es.js",
          "dist/locales/moment/gl.js": "node_modules/moment/locale/gl.js",
          "dist/locales/moment/ca.js": "node_modules/moment/locale/ca.js"
        }
      }
    },
    htmlmin: {
      main: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          removeComments: false,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        files: {
          'dist/index.html': 'dist/index.html'
        }
      }
    },
    karma: {
      options: {
        frameworks: ['jasmine'],
        files: [  //this files data is also updated in the watch handler, if updated change there too
          '<%= dom_munger.data.libnocompatjs %>',
          '<%= dom_munger.data.libjs %>',
          'avConfig.js',
          'avThemes.js',
          'avWidgets.js',
          '<%= dom_munger.data.appjs %>',
          '<%= ngtemplates.main.dest %>',
          '<%= ngtemplates.common.dest %>',
          'node_modules/angular-mocks/angular-mocks.js',
          'plugins/**/*.js',
          createFolderGlobs('*-spec.js')
        ],
        logLevel:'ERROR',
        reporters:['mocha'],
        autoWatch: false, //watching is handled by grunt-contrib-watch
        singleRun: true
      },
      all_tests: {
        browsers: ['PhantomJS','Chrome','Firefox']
      },
      headless: {
        browsers: ['PhantomJS']
      },
      during_watch: {
        browsers: ['PhantomJS']
      },
    },
    protractor: {
      options: {
        configFile: "node_modules/protractor/referenceConf.js", // Default config file
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        args: {
        // Arguments passed to the command
      }
    },
    //your_target: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
      all: {
      options: {
        configFile: "e2e.conf.js", // Target-specific config file
        args: {} // Target-specific arguments
      }
    },
  },

  });

  /*
   * Register the tasks
   */
  grunt.registerTask(
    'build',
    [
      'check_config', 
      'check_plugins_config',
      'jshint',
      'clean:before',
      'copy:temp',
      'less',
      'postcss',
      'dom_munger',
      'ngtemplates',
      'cssmin',
      'concat',
      'merge-json',
      'ngAnnotate',
      'uglify',
      'copy',
      'htmlmin',
      'clean:after'
    ]
  );
  grunt.registerTask('serve', ['dom_munger:read','jshint','connect', 'watch']);
  grunt.registerTask('test',['dom_munger:read','karma:headless']);
  grunt.registerTask('test-all',['dom_munger:read','karma:all_tests']);

  grunt.event.on('watch', function(action, filepath) {
    //https://github.com/gruntjs/grunt-contrib-watch/issues/156

    var tasksToRun = [];

    if ((filepath.lastIndexOf('.json') !== -1 && filepath.lastIndexOf('.json') === filepath.length - 5) ||
        (filepath.lastIndexOf('.js') !== -1 && filepath.lastIndexOf('.js') === filepath.length - 3)) {

      //lint the changed js file
      grunt.config('jshint.main.src', filepath);
      tasksToRun.push('jshint');

      //find the appropriate unit test for the changed file
      var spec = filepath;
      if (filepath.lastIndexOf('-spec.js') === -1 || filepath.lastIndexOf('-spec.js') !== filepath.length - 8) {
        spec = filepath.substring(0,filepath.length - 3) + '-spec.js';
      }

      //if the spec exists then lets run it
      if (grunt.file.exists(spec)) {
        var files = [].concat(grunt.config('dom_munger.data.libnocompatjs'));
        files.concat(grunt.config('dom_munger.data.libjs'));
        files.push('node_modules/angular-mocks/angular-mocks.js');
        files.push('avConfig.js');
        files.push('avThemes.js');
        files.push('avWidgets.js');
        files.concat(grunt.config('dom_munger.data.appjs'));
        files.concat(grunt.config('ngtemplates.main.dest'));
        files.push(spec);
        grunt.config('karma.options.files', files);
        tasksToRun.push('karma:during_watch');
      }
    }

    //if index.html changed, we need to reread the <script> tags so our next run of karma
    //will have the correct environment
    if (filepath === 'index.html') {
      tasksToRun.push('dom_munger:read');
    }

    grunt.config('watch.main.tasks',tasksToRun);

  });

  grunt.loadNpmTasks('grunt-protractor-runner');
};
