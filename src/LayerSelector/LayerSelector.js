/**
 * A module representing a LayerSelector.
 * @param {_WidgetBase} _WidgetBase - The base class for all widgets.
 * @param {_TemplatedMixin} _TemplatedMixin - Mixin for widgets that are instantiated from a template.
 * @module agrc/widgets/map/LayerSelector
*/
define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/_base/declare',
    'dojo/text!LayerSelector/LayerSelector/templates/LayerSelector.html',

    'xstyle/css!LayerSelector/LayerSelector/resources/LayerSelector.css'
], function (
    _TemplatedMixin,
    _WidgetBase,

    declare,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        /** @property {string} - The class' html `templateString`. */
        templateString: template,
        /** @property {string} - The class' css `baseClass` property. */
        baseClass: 'layer-selector',

        /** Overrides method of same name in dijit._Widget.
         * @param {esri/map|agrc/widgets/map/BaseMap} map - The map to control layer selection.
         * @param {esri/layers/layer} baseLayers - mutually exclusive layers (only one can be visible on your map).
         * @param {esri/layers/layer} overlays - layers you display over the `baseLayers`.
         */
        postCreate: function () {
            console.log('agrc.widgets.map.LayerSelector::postCreate', arguments);

            // check for map
            if (!this.map) {
                throw new Error('NullReferenceException: map. Pass the map in the constructor. ' +
                                '`new LayerSelector({map: map});`');
            }

            this.setupConnections();

            this.inherited(arguments);
        },
        /** wire events, and such */
        setupConnections: function () {
            console.log('agrc.widgets.map.LayerSelector::setupConnections', arguments);

        },
        /** Adds an esri/layer to `this.map`.
         * @param {esri/layer} - layer - the layer to be added to `this.map`.
         * @param {bool} - overlay - `true` if the layer should be added to the top of the map.
         */
        _addLayer: function (layer, overlay) {
            console.log('agrc.widgets.map.LayerSelector:_addLayer', arguments);

            this.map.add(layer, overlay ? this.map.layers.length : 0);
        }
    });
});
