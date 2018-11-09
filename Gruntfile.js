module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			css: {
				options: {
					sourceMap: true,
					imagePath: "/assets/images",
					includePaths: require('node-bourbon').includePaths
				},
				files: [{
					'assets/css/style.css': 'assets/css/style.scss'
				}]
			}
		},
		uglify: {
			js: {
				options: {
					sourceMap: true
				},
				files: {
					'assets/js/main.min.js': ['assets/js/main.js']
				}
			}
		},
		cssmin: {
			main: {
				options: {
					sourceMap: true
				},
				files: [{
					expand: true,
					cwd: 'assets/css',
					src: ['*.css', '!*.min.css'],
					dest: 'assets/css',
					ext: '.min.css'
				}]
			}
		},
		watch: {
			css: {
				files: ['assets/css/*.scss'],
				tasks: [
					'newer:sass:css', // Process SASS
					'newer:cssmin:main' // Process CSS
				],
				options: {
					spawn: false,
					message: "Changes updated."
				}
			},
			js: {
				files: ['assets/js/*.js', '!assets/js/*.min.js'],
				tasks: [
					'newer:uglify:js', // Process JS
				],
				options: {
					spawn: false,
					message: "Changes updated."
				}
			}

		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-newer');
	grunt.registerTask('default', [
		'newer:sass:css', // Process SASS
		'newer:cssmin:main', // Process CSS
		'newer:uglify:js' // Process JS
	]);
	grunt.registerTask('dev', ['watch', 'notify:watch']);
};
