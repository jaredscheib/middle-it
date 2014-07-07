module.exports = function(grunt){

  //Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // uglify: {
    //   options: {
    //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    //   },
    //   build: {
    //     src: 'src/<%= pkg.name %>.js',
    //     dest: 'build/<%= pkg.name %>.min.js'
    //   }
    // },

    //not working currently
    // watch: {
    //   scripts: {
    //     files: ['**/*.js'],
    //     // tasks: [],
    //     options: {
    //       reload: true,
    //       spawn: false
    //     }
    //   },
    //   configFiles: {
    //     files: [ 'Gruntfile.js' ],
    //     options: {
    //       reload: true
    //     }
    //   }
    // },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    shell: {
      prodServer: {
        command: 'git push azure master'
      }
    },

  });

  //Load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-shell');

  //Register dev tasks
  grunt.registerTask('server-dev', function(target){
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    // grunt.task.run(['watch']);
  });

  //Register main tasks
  grunt.registerTask('default', ['nodemon']);
  grunt.registerTask('test'); //test
  grunt.registerTask('build'); //build client files
  grunt.registerTask('upload', function(n){
    if( grunt.option('prod') ){
      grunt.task.run(['shell']);
    }else{
      grunt.task.run(['server-dev']);
    }
  });
  grunt.registerTask('deploy', ['upload']); //['test', 'build', 'upload']);
};