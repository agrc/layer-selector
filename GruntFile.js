module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var jasminePort = grunt.option('jasminePort') || 8001;
    var docPort = grunt.option('docPort') || jasminePort - 1;
    var testHost = 'http://localhost:' + jasminePort;
    var docHost = 'http:/localhost:' + docPort;
    var jsFiles = ['!bower_components', '*.js'];
    var otherFiles = ['templates/*.html', 'tests/*.html', 'resources/*.svg', 'tests/**/*.js'];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        amdcheck: {
            main: {
                options: {
                    removeUnusedDependencies: false
                },
                files: [{
                    src: 'Layer*.js'
                }]
            }
        },
        connect: {
            options: {
                livereload: true,
                port: jasminePort,
                base: '.'
            },
            docs: {
                options: {
                    port: docPort,
                    open: docHost + '/doc'
                }
            },
            open: {
                options: {
                    open: testHost + '/tests/_specRunner.html'
                }
            },
            jasmine: { }
        },
        jasmine: {
            main: {
                src: [],
                options: {
                    outfile: 'tests/_specRunner.html',
                    specs: ['tests/**/Spec*.js'],
                    vendor: [
                        'bower_components/jasmine-favicon-reporter/vendor/favico.js',
                        'bower_components/jasmine-favicon-reporter/jasmine-favicon-reporter.js',
                        'bower_components/jasmine-jsreporter/jasmine-jsreporter.js',
                        '../tests/dojoConfig.js',
                        'bower_components/dojo/dojo.js',
                        '../tests/jasmineAMDErrorChecking.js'
                    ],
                    host: testHost
                }
            }
        },
        shell : {
            options: {
                stdout: true
            },
            doc: {
                command: 'documentation .\\LayerSelector.js -t documentation-theme-default -o .\\doc\\LayerSelector.md -g -f md'
            },
            docItem: {
                command: 'documentation .\\LayerSelectorItem.js -t documentation-theme-default -o .\\doc\\LayerSelectorItem.md -g -f md'
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
                    cwd: './',
                    src: ['resources/*.styl'],
                    dest: './',
                    ext: '.css'
                }]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            amdcheck: {
                files: 'Layer*.js',
                tasks: ['amdcheck']
            },
            jshint: {
                files: jsFiles,
                tasks: ['newer:jshint:main', 'newer:jscs:main', 'jasmine:main:build', 'shell']
            },
            src: {
                files: jsFiles.concat(otherFiles)
            },
            stylus: {
                files: 'resources/*.styl',
                tasks: ['stylus']
            }
        }
    });

    grunt.registerTask('default', [
        'jasmine:main:build',
        'jshint:force',
        'jscs:force',
        'amdcheck:main',
        'shell',
        'connect:jasmine',
        'stylus',
        'watch'
    ]);

    grunt.registerTask('launch', [
        'jasmine:main:build',
        'jshint:force',
        'jscs:force',
        'amdcheck:main',
        'shell',
        'connect:open',
        'connect:docs',
        'stylus',
        'watch'
    ]);
};
