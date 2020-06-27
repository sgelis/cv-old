module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      all: ['dist/'],
      postbuild: [
        'dist/js/cv.babel.js',
        'dist/js/cv.all.js',
        'dist/css/all.css'
      ]
    },

    babel: {
  		options: {
  			sourceMap: false,
  			presets: ['env']
  		},
  		dist: {
  			files: {
  				'dist/js/cv.babel.js': 'src/js/cv.js'
  			}
  		}
  	},

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/vendors/jQuery/jquery-3.5.1.min.js',
              'src/vendors/Bootstrap/js/bootstrap.min.js',
              'dist/js/cv.babel.js'
            ],
        dest: 'dist/js/cv.all.js',
      },
    },

    uglify: {
      options: {
        sourceMap: false
      },
      build: {
        src: 'dist/js/cv.all.js',
        dest: 'dist/js/cv.min.js'
      }
    },

    concat_css: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/vendors/Bootstrap/css/bootstrap.min.css',
              'src/css/cv.css'
            ],
        dest: 'dist/css/all.css',
      }
    },

    cssmin: {
      target: {
        files: {
          'dist/css/cv.min.css': 'dist/css/all.css'
        }
      }
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'src',
            nonull: true,
            src: 'img/**',
            dest: 'dist/'
          },
          {
            expand: true,
            cwd: 'src',
            nonull: true,
            src: 'fonts/**',
            dest: 'dist/'
          },
          {
            expand: true,
            cwd: 'src',
            nonull: true,
            src: 'php/**',
            dest: 'dist/'
          },
          {
            expand: true,
            cwd: 'src/vendors/PHPMailer/',
            nonull: true,
            src: '*.php',
            dest: 'dist/php/vendors/PHPMailer/'
          },
          {
            expand: true,
            cwd: 'src/favicon/favicons/',
            nonull: true,
            src: '**',
            dest: 'dist/'
          },
          {
            expand: true,
            cwd: 'src',
            nonull: true,
            src: '*.pdf',
            dest: 'dist/'
          },
          // {
          //   expand: true,
          //   cwd: 'src',
          //   nonull: true,
          //   src: 'en/**',
          //   dest: 'dist/'
          // }
        ]
      }
    },

    minifyHtml: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.html'],
          dest: 'dist/'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-minify-html');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['clean:all', 'babel', 'concat', 'uglify', 'concat_css', 'cssmin', 'minifyHtml', 'copy', 'clean:postbuild']);

};
