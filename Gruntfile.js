/*
 * Resithemi
 * https://github.com/akchan/resithemi
 *
 * Copyright (c) 2016 Satoshi Funayama (akchan)
 * This software is released under the MIT License.
 */

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    less: {
        development: {
            options: {
                compress: false
            },
            files: {
                'css/resithemi.css': ['less/resithemi.less']
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['less:development']);
};