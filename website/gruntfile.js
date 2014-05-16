"use strict";

module.exports = function(grunt){
	
    /*
    Every time you want to add a new plugin (module) to the project, you have to add grunt.loadNpmTasks() call to your gruntfile.
    "matchdep" is a node module that reads package.json and extracts all dependencies
    */
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    /*
    This object contains all the tasks and configurations that we want to execute on our project
    */
    
    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),

        /** 
        - DEV 
        - Validate HTML 
        **/

        htmlhint: {
    		options: {
            	'tag-pair': true,
	            'tagname-lowercase': true,
		        'attr-lowercase': true,
    		    'attr-value-double-quotes': true,
        		'doctype-first': true,
	            'spec-char-escape': true,
		        'id-unique': true,
    		    'head-script-disabled': true,
        		'style-disabled': true
    		},
    		src: ['dev/index.html']
		},

        /** 
        - DEV 
        - Use JSHint module with npm to detect errors in JavaScript
        **/

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            beforeconcat: ['dev/js/*.js']
        },

        /** 
        - PROD 
        - Concatenate JS files
        **/

        concat: {
            options: {
                seperator: ';', // add ';' between files
                banner: "'use strict';\n", // Replace all 'use strict' statements with a single one at the top
                process: function(src, filepath) {
                      return '// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                }
            },

            prod: {
                src:['dev/js/libs/*.js', 'dev/js/*.js'],
                dest: 'prod/js/production.min.js'
            }
        },

        /** 
        - PRODUCTION 
        - Use UgligyJS module with npm to Minify JavaScript
        **/

        uglify: {
            prod: {
                src: 'prod/js/production.min.js',
                dest: 'prod/js/production.min.js'
            }
        },

        /** 
        - PRODUCTION 
        - Compile and compress SASS
        **/
        
        sass: {
            dist: {
                options: {
                    style: 'expanded' // compressed
                },
                files: {
                    'dev/css/global.css': 'dev/css/global.scss'
                }
            }
        },

        /** 
        - PRODUCTION 
        - Minify CSS
        **/

        cssmin: {
            prod: {
                expand: true,
                cwd: 'dev/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'prod/css/',
                ext: '.min.css'                
            }
        },

        /** 
        - PRODUCTION 
        - Add vendor prefixes to CSS rules using the Can I Use database to determine which prefixes are needed
        **/

        autoprefixer: {
            dist: {
                expand: true,
                cwd: 'dev',
                src: [ '**/*.css' ],
                dest: 'dev'
            }
        },
        
        /** 
        - PRODUCTION 
        - Image minification
        **/
        
        imagemin: {
            prod: {
                files: [{
                    expand: true,
                    cwd: 'dev/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'prod/images/'
                }]
            }
        },

        /** 
        - PRODUCTION 
        - Copy files
        **/

        copy: {
          prod: {
            files: [
                {expand:true, cwd: 'dev/', flatten: true, src:['index.html'], dest: 'prod/', filter: 'isFile'}
            ]
          }
        },

        /*
        Grunt will "Watch" these files when you change/remove
        */
        watch: {
            options: {
                livereload: true,
            },
            html: {
                files: ['dev/index.html'],
                tasks: ['htmlhint', 'copy:prod']
            },
            css: {
                files: ['dev/css/global.scss'],
                tasks: ['sass', 'autoprefixer', 'cssmin:prod'],
                options: {
                    spawn: false,
                },  
            },
            js: {
                files: ['dev/js/*.js'],
                tasks: ['jshint', 'concat', 'uglify'],
                options: {
                    spawn: false,
                },
            }
        }
    });
    
    // Grunt will run this Task When we type "grunt" in terminal
    grunt.registerTask('default', ['watch']);
    // Grunt will run this task when we type "grunt prod" in termial
    grunt.registerTask('prod', ['imagemin']);
    
};
