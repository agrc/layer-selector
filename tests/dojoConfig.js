/* global JasmineFaviconReporter */
window.dojoConfig = {
    baseUrl: '../node_modules',
    packages: [
        'dojo',
        'dijit',
        'dojox',
        'moment',
        {
            name: 'layer-selector',
            location: '../',
            main: 'LayerSelector'
        }, {
            name: 'stubmodule',
            main: 'stub-module'
        }, {
            name: 'esri',
            location: 'arcgis-js-api'
        }, {
            name: '@dojo',
            location: '@dojo'
        }, {
            name: 'cldrjs',
            location: 'cldrjs',
            main: 'dist/cldr'
        }, {
            name: 'globalize',
            location: 'globalize',
            main: 'dist/globalize'
        }, {
            name: 'maquette',
            location: 'maquette',
            main: 'dist/maquette.umd'
        }, {
            name: 'maquette-css-transitions',
            location: 'maquette-css-transitions',
            main: 'dist/maquette-css-transitions.umd'
        }, {
            name: 'maquette-jsx',
            location: 'maquette-jsx',
            main: 'dist/maquette-jsx.umd'
        }, {
            name: 'tslib',
            location: 'tslib',
            main: 'tslib'
        }
    ],
    has: {
        'dojo-undef-api': true
    }
};

if (window.jasmine) {
    window.jasmine.getEnv().addReporter(new JasmineFaviconReporter());
}
