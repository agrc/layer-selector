module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var jasminePort = grunt.option('jasminePort') || 8001;

    var jsAppFiles = 'src/layer-selector/**/*.js';
    var otherFiles = [
        'src/layer-selector/**/*.html',
        'src/layer-selector/**/*.css'
    ];
    var gruntFile = 'GruntFile.js';
    var jsFiles = [
        jsAppFiles,
        gruntFile
    ];
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        amdcheck: {
            main: {
                options: {
                    removeUnusedDependencies: false
                },
                files: [{
                    src: [
                        'src/layer-selector/*.js'
                    ]
                }]
            }
        },
        connect: {
            options: {
                livereload: true,
                port: jasminePort,
                base: {
                    path: '.',
                    options: {
                        index: '_SpecRunner.html'
                    }
                }
            },
            open: {
                options: {
                    open: true
                }
            },
            jasmine: { }
        },
        jasmine: {
            main: {
                src: [],
                options: {
                    specs: ['src/layer-selector/**/spec-*.js'],
                    vendor: [
                        'src/jasmine-favicon-reporter/vendor/favico.js',
                        'src/jasmine-favicon-reporter/jasmine-favicon-reporter.js',
                        'src/jasmine-jsreporter/jasmine-jsreporter.js',
                        'src/layer-selector/tests/run.js',
                        'src/dojo/dojo.js',
                        'src/layer-selector/tests/jasmineAMDErrorChecking.js'
                    ],
                    host: 'http://localhost:' + jasminePort
                }
            }
        },
        jscs: {
            main: {
                src: jsFiles
            },
            force: {
                src: jsFiles,
                options: {
                    force: true
                }
            }
        },
        jshint: {
            main: {
                src: jsFiles
            },
            force: {
                // must use src for newer to work
                src: jsFiles,
                options: {
                    force: true
                }
            },
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: '.jshintrc'
            }
        },
        stylus: {
            main: {
                options: {
                    compress: false
                },
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['layer-selector/**/*.styl'],
                    dest: 'src/',
                    ext: '.css'
                }]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            jshint: {
                files: jsFiles,
                tasks: ['newer:jshint:main', 'newer:jscs:main', 'jasmine:main:build']
            },
            src: {
                files: jsFiles.concat(otherFiles)
            },
            stylus: {
                files: 'src/layer-selector/**/*.styl',
                tasks: ['stylus']
            }
        }
    });

    grunt.registerTask('default', [
        'jasmine:main:build',
        'jshint:force',
        'jscs:force',
        'amdcheck:main',
        'connect:jasmine',
        'stylus',
        'watch'
    ]);

    grunt.registerTask('launch', [
        'jasmine:main:build',
        'jshint:force',
        'jscs:force',
        'amdcheck:main',
        'connect:open',
        'stylus',
        'watch'
    ]);
};
