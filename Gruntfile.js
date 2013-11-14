module.exports = function(grunt) {
  grunt.initConfig({
    mochaTest: {
      test: {
        src: 'test/**/*.js'
      }
    }
  });

  grunt.registerTask('build', function() {
    var macro = grunt.file.read('./src/macro.js');
    var regex = /MACRO_NAME/gm;
    grunt.file.write('./macros/index.js', macro.replace(regex, 'λ'));
    grunt.file.write('./macros/fun/index.js', macro.replace(regex, 'fun'));
    grunt.file.write('./macros/lam/index.js', macro.replace(regex, 'lam'));
  });

  grunt.registerTask('build-test', function() {
    grunt.file.write('./test/tests.js', compileFile('./test/tests.sjs', true));
  });

  grunt.registerTask('compile', function(fileName) {
    console.log(compileFile(fileName));
  });

  function compileFile(fileName, isTest) {
    var macro = grunt.file.read('./macros/index.js');
    var test  = isTest ? grunt.file.read('./test/macros.sjs') : '';
    var file  = grunt.file.read(fileName);
    var sweet = require('sweet.js');
    return sweet.compile([macro, test, file].join('\n'));
  }

  grunt.registerTask('default', ['build']);
  grunt.registerTask('test', ['build', 'build-test', 'mochaTest']);
  grunt.loadNpmTasks('grunt-mocha-test');
};
