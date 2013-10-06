/* jshint node: true */

module.exports = function(grunt) {
	"use strict";

	var fs = require('fs')
		,_ = require('underscore')
		,path = require('path');





	var init_project = function(project_name){
		if (grunt.config.get('initialized') == true) return grunt.config.get('project');
		if (! project_name){
			grunt.log.error('Specify a project name like this... grunt <command>:project-name');
			return false;
		}
		var p = path.join('projects', project_name);
		var cfg_path = path.join(p, 'project.json');
		var project;
		if (fs.existsSync(cfg_path)){
			project = grunt.file.readJSON(cfg_path);
		} else {
			project = {
				name: project_name
				, description: 'New project. Put your description here.'
				, version: '0.0.0'
				, targets: []
			};
		}

		var version = project.version.split('.');
		var last = parseInt(version.pop());
		version.push(last + 1);
		project.version = version.join('.');

		var cfg = {
			initialized: true,
			pkg: grunt.file.readJSON('package.json'),
			project: project,
			project_path: p,
			date: new Date().toUTCString(),
			bootstrap_directory: path.resolve('bootstrap'),
			bootstrap_pkg: grunt.file.readJSON('bootstrap/package.json'),
			banner: '/*!\n' +
				' * <%= project.name %> v. <%= project.version %> Compiled by <%= pkg.english_name %> at <%= date %>.\n' +
				' * \n' +
				' * Bootstrap v<%= bootstrap_pkg.version %> by @fat and @mdo\n' +
				' * Copyright <%= grunt.template.today("yyyy") %> <%= bootstrap_pkg.author %>\n' +
				' * Licensed under <%= _.pluck(bootstrap_pkg.licenses, "url").join(", ") %>\n' +
				' *\n' +
				' * Designed and built with all the love in the world by @mdo and @fat.\n' +
				' */\n',
			jqueryCheck: 'if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }\n\n',
			recess: {
				options: {
					compile: true,
					banner: '<%= banner %>'
				},
				full: {
					src: ['projects/<%= project.name %>/less/style.less'],
					dest: 'projects/<%= project.name %>/assets/css/style.css'
				},
				min: {
					options: {
						compress: true
					},
					src: ['projects/<%= project.name %>/less/style.less'],
					dest: 'projects/<%= project.name %>/assets/css/style.min.css'
				}
			},
			uglify: {
				options: {
					banner: '<%= banner %>',
					report: 'min'
				},
				bootstrap: {
					src: ['<%= concat.bootstrap.dest %>'],
					dest: 'projects/<%= project.name %>/assets/js/<%= bootstrap_pkg.name %>.min.js'
				}
			},
			concat: {
				options: {
					banner: '<%= banner %><%= jqueryCheck %>',
					stripBanners: false
				},
				bootstrap: {
					src: [
						'<%= bootstrap_directory %>/js/transition.js',
						'<%= bootstrap_directory %>/js/alert.js',
						'<%= bootstrap_directory %>/js/button.js',
						'<%= bootstrap_directory %>/js/carousel.js',
						'<%= bootstrap_directory %>/js/collapse.js',
						'<%= bootstrap_directory %>/js/dropdown.js',
						'<%= bootstrap_directory %>/js/modal.js',
						'<%= bootstrap_directory %>/js/tooltip.js',
						'<%= bootstrap_directory %>/js/popover.js',
						'<%= bootstrap_directory %>/js/scrollspy.js',
						'<%= bootstrap_directory %>/js/tab.js',
						'<%= bootstrap_directory %>/js/affix.js'
					],
					dest: 'projects/<%= project.name %>/assets/js/<%= bootstrap_pkg.name %>.js'
				}
			},

			clean: {
				options: {force: true},
				update_css: [],
				update_fonts: [],
				update_js: []
			},
			copy: {
				init_project: {
					files: [
						{
							expand: true,
							src: ['**'],
							dest: 'projects/<%= project.name %>',
							cwd: 'sample-project/'
						}
					]

				},
				update_fonts: {
					files: [
						{
							expand: true,
							src: ['**'],
							dest: 'projects/<%= project.name %>/assets/fonts',
							cwd: '<%= bootstrap_directory %>/fonts/'
						}
					]

				},


				js: {
					files: []
				},
				css: {
					files: []
				}
			},
			watch: {
				recess: {
					files: 'projects/<%= project.name %>/less/*',
					tasks: ['compile:<%= project.name %>']
				}
			}
		};




		_.each(project.targets, function(target){
			cfg.clean.update_fonts.push(target + '/assets/fonts');
			cfg.clean.update_js.push(target + '/assets/js');
			cfg.copy.update_fonts.files.push({
				expand: true,
				src: ['**'],
				dest: target + '/assets/fonts',
				cwd: 'projects/<%= project.name %>/assets/fonts/'
			});
			cfg.copy.js.files.push({
				expand: true,
				src: ['**'],
				dest: target + '/assets/js',
				cwd: 'projects/<%= project.name %>/assets/js/'
			});
			cfg.copy.css.files.push({
				expand: true,
				src: ['**'],
				dest: target + '/assets/css',
				cwd: 'projects/<%= project.name %>/assets/css/'
			});
		});

		grunt.initConfig(cfg);

		return grunt.config.get('project');
	};




	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-recess');


	// Project initialization.
	grunt.registerTask('init', 'Initialize a project.', function(project_name){
		var project = init_project(project_name);
		if (! project){
			return false;
		}
		var p = grunt.config.get('project_path');
		if (fs.existsSync(p)){
			grunt.log.error('A project at ' + p + ' already exists.');
			return false;
		}
		grunt.task.run(
			'copy:init_project',
			'copy:update_fonts',

			'compile'
		);
		return true;
	});

	grunt.registerTask('compile', 'Compile a project\'s less into css.', function(project_name){
		var project = init_project(project_name);
		if (! project){
			return false;
		}
		grunt.task.run(
			'recess:full',
			'recess:min',
			'clean:css',
			'clean:js',
			'clean:fonts',
			'copy:css',
			'copy:js',
			'copy:fonts',
			'bump'
		);
		return true;
	});

	grunt.registerTask('watcher','Watch a project\'s less files and compile into css.',function(project_name){
		var project = init_project(project_name);
		if (! project){
			return false;
		}
		grunt.task.run(
			'compile',
			'watch'
		);
		return true;
	});
	grunt.registerTask('bump', 'Bump a project\'s version.', function(project_name){
		var project = init_project(project_name);
		if (! project){
			return false;
		}
		var p = path.join('projects', project.name);
		var cfg_p = path.join(p, 'project.json');
		grunt.file.write(cfg_p, JSON.stringify( project, null, '\t'));
		return true;
	});

	grunt.registerTask('update-fonts', 'Update a project\'s fonts.', function(project_name){
		var project = init_project(project_name);
		if (! project){
			return false;
		}
		var q = ['clean:update_fonts', 'copy:update_fonts'];
		if (project_name) q.push('bump');
		grunt.task.run(q);
		return true;
	});

	grunt.registerTask('update-bootstrap-js', 'Update a project\'s bootstrap js.', function(project_name){
		var project = init_project(project_name);
		if (! project){
			return false;
		}
		var q = ['concat:bootstrap','uglify:bootstrap', 'clean:update_js', 'copy:update_js'];
		if (project_name) q.push('bump');
		grunt.task.run(q);
		return true;
	});


};
