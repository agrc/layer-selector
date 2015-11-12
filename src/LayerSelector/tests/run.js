/* global JasmineFaviconReporter, jasmineRequire */
window.dojoConfig = {
    baseUrl: './',
    packages: [
        {
            name: 'LayerSelector',
            location: 'src/'
        }, {
            name: 'dojo',
            location: 'src/dojo'
        }, {
            name: 'dijit',
            location: 'src/dijit'
        }, {
            name: 'dojox',
            location: 'src/dojox'
        }, {
            name: 'esri',
            location: 'src/esri'
        }, {
            name: 'stubmodule',
            location: 'src/stubmodule/src',
            main: 'stub-module'
        },{
            name: 'xstyle',
            location: 'src/xstyle'
        }
    ],
    has: {'dojo-undef-api': true}
};

// for jasmine-favicon-reporter
jasmine.getEnv().addReporter(new JasmineFaviconReporter());
jasmine.getEnv().addReporter(new jasmineRequire.JSReporter2());
