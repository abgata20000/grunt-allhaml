/*
 * grunt-allhaml
 * https://github.com/abgata20000/grunt-allhaml
 *
 * Copyright (c) 2014 abgata20000
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var path = require('path');
  var async = grunt.util.async;
  var _    = grunt.util._;
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('allhaml', 'The best Grunt plugin ever.', function() {
    // Set the target options with some defaults.
    var options = this.options({
      // Default target is javascript.
      target: 'html',

      // Default language choice to coffee-script and haml-coffee.
      language: 'js',

      // Default placement; either `amd` or `global`.
      placement: 'global',

      // Default global placement namespace to `window`.
      namespace: 'window.HAML',

      // Default hash of dependencies for AMD.
      dependencies: {},

      // Default should name include path
      includePath: false,

      // Default path relative to
      pathRelativeTo: './',

      // External haml command to execute, must accept STDIN
      rubyHamlCommand: 'haml -t ugly',

      // Precompile templates; if false (and target == 'js'), place rendered
      // HTML in js variables.
      precompile: true,

      punctuation: '.',

      separator: ', ',

      hamlcommand: 'haml',

      hamloption: '-q --no-escape-attrs',

      in_dir: 'haml',

      out_dir: 'html',

      in_ex: 'haml',

      out_ex: 'html'


    });

    // Make the test async.
    var done = this.async();

    // Write options iff verbose.
    // grunt.verbose.writeflags(options, 'Options');

    // Transpile each src/dest group of files.
    //async.forEach(this.files, function(f, callback) {
    this.files.forEach(function(f) {
      var commands = [];
      async.forEach(f.src, function(src, callback){
        var search_in_dir = new RegExp("^" + options.in_dir + "/");
        var search_in_ex = new RegExp("." + options.in_ex + "$");
        var htmlfile = '';
        htmlfile = src.replace(search_in_dir, options.out_dir + '/');
        htmlfile = htmlfile.replace(search_in_ex, '.' + options.out_ex);
        htmlfile = options.pathRelativeTo + htmlfile;
        //
        var dirpath = path.dirname(htmlfile);
        grunt.file.mkdir(dirpath);
        //
        var cmd = options.hamlcommand  + ' ' + options.pathRelativeTo + src + ' ' + htmlfile + ' ' + options.hamloption;
        // commands.push(cmd);

        var p = options.pathRelativeTo + src;
        var exec = require('child_process').exec;
        var output;
        var result = exec(cmd, function(error, stdout, stderr) {
          if (result.error || error) {
            grunt.fail.warn(
              "Error executing haml on " + p + ": \n" +
              stderr + "\n" +
              stdout
            );
          }

          if (stderr) {
            grunt.log.warn(
              "Error executing haml on " + p + ": \n" +
              stderr + "\n" +
              stdout
            );
          }

          output = stdout;

          if (options.wrapHtmlInJs) {
            output = wrapIt(htmlescape(output), options);
          }

          grunt.log.writeln('File "' + htmlfile + '" created.');

          callback(output);
        });


      }, done);

    });

  });

};
