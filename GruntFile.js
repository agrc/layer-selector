module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var jasminePort = grunt.option('jasminePort') || 8001;
    var docPort = grunt.option('docPort') || jasminePort - 1;
    var testHost = 'http://localhost:' + jasminePort;
    var docHost = 'http:/localhost:' + docPort;
    var jsFiles = ['!bower_components', '!node_modules', '!.git', '!.grunt', '*.js'];
    var otherFiles = ['templates/*.html', 'tests/*.html', 'resources/*.svg', 'tests/**/*.js'];
    var bumpFiles = [
        'package.json',
        'bower.json'
    ];
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
        bump: {
            options: {
                files: bumpFiles,
                push: false
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
        documentation: {
            LayerSelector: {
                files: [{
                    src: 'LayerSelector.js'
                }],
                options: {
                    github: true,
                    format: 'md',
                    filename: './doc/LayerSelector.md'
                }
            },
            LayerSelectorItem: {
                files: [{
                    src: 'LayerSelectorItem.js'
                }],
                options: {
                    github: true,
                    format: 'md',
                    filename: './doc/LayerSelectorItem.md'
                }
            },
            LayerSelectorHtml: {
                files: [{
                    src: 'LayerSelector.js'
                }],
                options: {
                    github: true,
                    destination: './doc'
                }
            },
            LayerSelectorItemHtml: {
                files: [{
                    src: 'LayerSelectorItem.js'
                }],
                options: {
                    github: true,
                    destination: './doc'
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
            docs: {
                files: 'Layer*.js',
                tasks: ['documentation:LayerSelector', 'documentation:LayerSelectorItem']
            },
            jshint: {
                files: jsFiles,
                tasks: ['newer:jshint:main', 'newer:jscs:main', 'jasmine:main:build']
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
        'connect:jasmine',
        'stylus',
        'watch:amdcheck',
        'watch:jshint',
        'watch:src',
        'watch:stylus'
    ]);

    grunt.registerTask('launch', [
        'jasmine:main:build',
        'jshint:force',
        'jscs:force',
        'amdcheck:main',
        'connect:open',
        'connect:docs',
        'stylus',
        'watch:amdcheck',
        'watch:jshint',
        'watch:src',
        'watch:stylus'
    ]);

    grunt.registerTask('docs', [
        'documentation:LayerSelector',
        'documentation:LayerSelectorItem',
        'connect:docs',
        'watch:docs'
    ]);

    grunt.registerTask('doc-selector', [
        'documentation:LayerSelectorHtml',
        'connect:docs',
        'watch:docs'
    ]);

    grunt.registerTask('doc-selector-item', [
        'documentation:LayerSelectorItemHtml',
        'connect:docs',
        'watch:docs'
    ]);
};
