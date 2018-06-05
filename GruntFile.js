module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var defaultPort = 8001;
    var jasminePort = grunt.option('jasminePort') || defaultPort;
    var docPort = grunt.option('docPort') || jasminePort - 1;
    var testHost = 'http://localhost:' + jasminePort;
    var docHost = 'http:/localhost:' + docPort;
    var jsFiles = ['!node_modules', '!.git', '!.grunt', '*.js', 'tests/**/*.js'];
    var otherFiles = ['templates/*.html', 'tests/*.html', 'resources/*.svg'];
    var bumpFiles = [
        'package.json',
        'package-lock.json'
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
                commitFiles: bumpFiles,
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
                    open: docHost + '/docs'
                }
            },
            open: {
                options: {
                    open: testHost + '/tests/_specRunner.html'
                }
            },
            jasmine: { }
        },
        documentation: {
            options: {
                destination: './docs'
            },
            LayerSelector: {
                files: [{
                    src: 'LayerSelector.js'
                }],
                options: {
                    github: true,
                    format: 'md',
                    filename: 'LayerSelector.md'
                }
            },
            LayerSelectorItem: {
                files: [{
                    src: 'LayerSelectorItem.js'
                }],
                options: {
                    github: true,
                    format: 'md',
                    filename: 'LayerSelectorItem.md'
                }
            },
            LayerSelectorHtml: {
                files: [{
                    src: 'LayerSelector.js'
                }]
            },
            LayerSelectorItemHtml: {
                files: [{
                    src: 'LayerSelectorItem.js'
                }]
            }
        },
        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            main: {
                src: jsFiles
            }
        },
        jasmine: {
            main: {
                src: [],
                options: {
                    outfile: 'tests/_specRunner.html',
                    specs: ['tests/**/Spec*.js'],
                    vendor: [
                        'node_modules/jasmine-favicon-reporter/vendor/favico.js',
                        'node_modules/jasmine-favicon-reporter/jasmine-favicon-reporter.js',
                        '../tests/dojoConfig.js',
                        'node_modules/dojo/dojo.js',
                        '../tests/jasmineAMDErrorChecking.js'
                    ],
                    host: testHost
                }
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
            docItem: {
                files: 'LayerSelectorItem.js',
                tasks: ['documentation:LayerSelectorItemHtml', 'documentation:LayerSelectorItem']
            },
            docSelector: {
                files: 'LayerSelector.js',
                tasks: ['documentation:LayerSelectorHtml', 'documentation:LayerSelector']
            },
            eslint: {
                files: jsFiles,
                tasks: ['newer:eslint:main', 'jasmine:main:build']
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
        'eslint:main',
        'amdcheck:main',
        'connect:jasmine',
        'stylus',
        'watch:src',
        'watch:eslint',
        'watch:stylus',
        'watch:amdcheck'
    ]);

    grunt.registerTask('launch', [
        'jasmine:main:build',
        'eslint:main',
        'amdcheck:main',
        'connect:open',
        'stylus',
        'watch:src',
        'watch:eslint',
        'watch:stylus',
        'watch:amdcheck'
    ]);

    grunt.registerTask('docs', [
        'documentation:LayerSelector',
        'documentation:LayerSelectorItem'
    ]);

    grunt.registerTask('doc-selector', [
        'documentation:LayerSelectorHtml',
        'connect:docs',
        'watch:docSelector'
    ]);

    grunt.registerTask('doc-selector-item', [
        'documentation:LayerSelectorItemHtml',
        'connect:docs',
        'watch:docItem'
    ]);

    grunt.registerTask('travis', [
        'eslint:main',
        'connect:jasmine',
        'jasmine'
    ]);
};
