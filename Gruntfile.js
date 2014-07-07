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
    }

  });

  //Load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');

  //Register tasks
  grunt.registerTask('default', ['nodemon']);
};