module.exports = function(grunt) {
  grunt.initConfig({
    mochaTest: {
      test: {
        src: 'test/**/*.js'
      }
    }
  });

  var aliases = [
    'fn', 
    'fun', 
    'func',
    'lam'
  ];

  grunt.registerTask('build', function() {
    var macro = grunt.file.read('./src/macro.js');
    var regex = /MACRO_NAME/gm;
    grunt.file.write('./macros/index.js', macro.replace(regex, 'λ'));

    aliases.forEach(function(name) {
      grunt.file.write('./macros/' + name + '/index.js', macro.replace(regex, name));
    });
  });

  grunt.registerTask('alias', function(name, file) {
    var macro = grunt.file.read('./src/macro.js');
    var regex = /MACRO_NAME/gm;
    grunt.file.write(file, macro.replace(regex, name));
  });

  grunt.registerTask('build-test', function() {
    grunt.file.write('./test/tests.js', compileFile('./test/tests.sjs', true));
  });

  grunt.registerTask('compile', function(fileName) {
    console.log(compileFile(fileName));
  });

  var moduleCtx;

  function compileFile(fileName, isTest) {
    var macro = grunt.file.read('./macros/index.js');
    var test  = isTest ? grunt.file.read('./test/macros.sjs') : '';
    var file  = grunt.file.read(fileName);
    var sweet = require('sweet.js');

    if (!moduleCtx) moduleCtx = sweet.loadModule(macro);

    return sweet.compile(test + file, {
      modules: [moduleCtx],
      readableNames: true,
    }).code;
  }

  grunt.registerTask('default', ['build']);
  grunt.registerTask('test', ['build', 'build-test', 'mochaTest']);
  grunt.loadNpmTasks('grunt-mocha-test');
};
