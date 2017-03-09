// Gruntfile.js
module.exports = grunt => {

  // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jsbeautifier: {
      files: ["*.js", "_lib/**/*.js", "_models/**/*.js", "_test/**/*.js", "_util/**/*.js"],
      options: {
        js: {
          braceStyle: "end-expand",
          breakChainedMethods: false,
          e4x: false,
          evalCode: false,
          indentChar: " ",
          indentLevel: 0,
          indentSize: 2,
          indentWithTabs: false,
          jslintHappy: false,
          keepArrayIndentation: false,
          keepFunctionIndentation: false,
          maxPreserveNewlines: 10,
          preserveNewlines: true,
          spaceBeforeConditional: false,
          spaceInParen: false,
          unescapeStrings: false,
          wrapLineLength: 0,
          endWithNewline: true
        }
      }
    }
  });
  grunt.registerTask('default', ['jsbeautifier']);
};
