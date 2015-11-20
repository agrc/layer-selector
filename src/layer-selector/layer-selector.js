/**
 * A module representing a layer-selector.
 * @param {_WidgetBase} _WidgetBase - The base class for all widgets.
 * @param {_TemplatedMixin} _TemplatedMixin - Mixin for widgets that are instantiated from a template.
 * @module layer-selector/layer-selector
*/
define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!layer-selector/templates/layer-selector.html',
    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/_base/lang',

    'layer-selector/layer-selector-item'
], function (
    _TemplatedMixin,
    _WidgetBase,

    domClass,
    domConstruct,
    template,
    array,
    declare,
    lang,

    LayerSelectorItem
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        /** @property {string} - The class' html `templateString`. */
        templateString: template,
        /** @property {string} - The class' css `baseClass` property. */
        baseClass: 'layer-selector',
        /** @property {string} - HTML fragment. */
        separator: '<hr class="layer-selector-separator" />',
        /** @property {bool} - True if the widget should be in the top of the container. */
        top: true,
        /** @property {bool} - True if the widget should be in the right of the container. */
        right: true,

        /** The initilizer for the class.
         * @param {{Object}} - params - The params passed into the constructor.
         */
        constructor: function (params) {
            console.log('layer-selector:constructor', arguments);

            // check for map
            if (!params.map) {
                throw new Error('Missing map in layer-selector. `new layer-selector({map: map});`');
            }
        },
        /** Overrides method of same name in dijit._Widget.
         * @param {esri/map|agrc/widgets/map/BaseMap} map - The map to control layer selection.
         * @param {[esri/layers/layer]} baseLayers - mutually exclusive layers (only one can be visible on your map).
         * @param {[esri/layers/layer]} overlays - layers you display over the `baseLayers`.
         */
        postCreate: function () {
            console.log('layer-selector::postCreate', arguments);

            this._setupConnections();
            this._polyfill();

            this.inherited(arguments);

            if (!this.baseLayers || this.baseLayers.length < 1) {
                domClass.add(this.domNode, this.baseClass + '-hidden');
                return;
            }

            var locations = {
                top: this.top,
                right: this.right
            };

            this._placeWidget(locations, this.domNode, this.map.root, this.baseClass);

            this._buildUi(this.baseLayers || [], this.overlays || []);
        },
        /** wire events, and such */
        _setupConnections: function () {
            console.log('layer-selector::_setupConnections', arguments);

        },
        /** Takes the `baseLayers` and `overlays` and creates the UI markup.
         * @param {[esri/layers/layer]} baseLayers - mutually exclusive layers (only one can be visible on your map).
         * @param {[esri/layers/layer]} overlays - layers you display over the `baseLayers`.
         */
        _buildUi: function (baseLayers, overlays) {
            console.log('layer-selector:_buildUi', arguments);

            var numberOfElementsPerRow = 1;

            this.baseLayerWidgets = this._buildLayerItemWidgets(baseLayers, this.layerContainer, 'radio');
            this.overlayWidgets = this._buildLayerItemWidgets(overlays, this.layerContainer, 'checkbox');

            if (this.baseLayerWidgets.length === 1) {
                this.baseLayerWidgets[0].set('hidden', true);
            }

            var visibleBaseLayers = array.filter(this.baseLayerWidgets, function findVisible(layer) {
                return !layer.get('hidden');
            });

            if (visibleBaseLayers.length === 0 && this.overlayWidgets.length === 0) {
                domClass.add(this.domNode, this.baseClass + '-hidden');
                return;
            }

            this._selectLayerElements(baseLayers, this.baseLayerWidgets, true);
            this._selectLayerElements(overlays, this.overlayWidgets, false);

            if (visibleBaseLayers.length > 0 && this.overlayWidgets.length > 0) {
                if (this.overlayWidgets && this.overlayWidgets.length) {
                    domConstruct.place(this.separator, this.layerContainer, this.baseLayerWidgets.length * numberOfElementsPerRow);
                }
            }
        },
        /** Places the widget in the map container and in which corner using this.top and this.right.
         * @param {object} locations - contains a  boolean `top` and `right` property for determining
         * which corner to place the widget.
         * @param {domNode} node - the root node of the widget.
         * @param {domNode} refNode - the reference node for placing the widget.
         * @param {string} baseClass - the base css class for suffixing the placement css classes.
         */
        _placeWidget: function (locations, node, refNode, baseClass) {
            console.log('layer-selector:_placeWidget', arguments);

            if (!locations.top) {
                domClass.replace(node, baseClass + '-bottom', baseClass + '-top');
            }

            if (!locations.right) {
                domClass.replace(node, baseClass + '-left', baseClass + '-right');
            }

            domConstruct.place(node, refNode);
        },
        /** Takes the `baseLayers` or `overlays` and addes them to the `container`.
         * @param {[esri/layers]} - layers - mutually exlusive layers (only one can be visible on your map).
         * @param {domNode} - container - the dom node to hold the created elements.
         * @param {string} - type - radio or checkbox.
         * @returns {[DomNodes]} - the nodes placed.
         */
        _buildLayerItemWidgets: function (layers, container, type) {
            console.log('layer-selector:_buildLayerItemWidgets', arguments);

            if (!layers || !layers.length) {
                return [];
            }

            var widgets = [];
            layers.forEach(function (layer) {
                var item = new LayerSelectorItem({
                    layer: layer,
                    type: type
                }).placeAt(container);

                this.own(
                    item.on('changed', lang.hitch(this, '_updateMap')),
                    item
                );

                widgets.push(item);
            }, this);

            return widgets;
        },
        /** selects the radio box or checkbox for layers.
         * @param {[esri/layers]} - layers - layers to be added to the selector.
         * @param {[layer-selector-item]} - widgets - the html representation of the layer.
         * @param {bool} - firstOnly - only select the first item. Or select them all.
         */
        _selectLayerElements: function (layers, widgets, firstOnly) {
            console.log('layer-selector:_selectLayerElements', arguments);

            if (!layers || !layers.length) {
                return;
            }

            if (firstOnly) {
                var selectedIndex = -1;
                var found = layers.find(function findSelected(layer, i) {
                    selectedIndex = i;
                    return layer.selected;
                }, this);

                if (found) {
                    widgets[selectedIndex].set('selected', true);
                } else {
                    if (widgets.length > 0) {
                        widgets[0].set('selected', true);
                    }
                }

                return;
            }

            array.forEach(layers, function findSelected(layer, i) {
                if (layer.selected) {
                    widgets[i].set('selected', true);
                }
            });
        },
        /** Recieves the old, new, and property from the selected watcher.
         * @param {Object} - args - contains old, new, and property name that changed.
         * @returns return_type - return_description
         */
        _updateMap: function (args) {
            console.log('layer-selector:_updateMap', arguments);

            if (args.selected === false && args.layerType === 'base-layer') {
                return;
            }
            var managedLayers = this.get('managedLayers') || {};

            var keys = Object.keys(managedLayers);
            if (keys.length > 0 && args.layerType === 'base-layer') {
                array.forEach(keys, function suspendBaseMaps(layer) {
                    if (managedLayers[layer] === 'base-layer') {
                        this.map.getLayer(layer).suspend();
                    }
                }, this);
            }

            if (keys.indexOf(args.layer.id) < 0) {
                managedLayers[args.layer.id] = args.layerType;
            }

            this.set('managedLayers', managedLayers);

            var layer = this.map.getLayer(args.layer.id);
            if (!layer) {
                layer = new args.layer.factory(args.layer.url, args.layer);

                var index = 0;
                if (args.layerType !== 'base-layer') {
                    array.forEach(Object.keys(managedLayers), function (key, i) {
                        if (managedLayers[key] === 'base-layer') {
                            index = i + 1;
                        }
                    });
                }
                this.map.addLayer(layer, index);
            }
            if (args.selected === true) {
                layer.resume();
            } else {
                layer.suspend();
            }

            if (args.layerType === 'base-layer') {
                this._syncSelectedWithUi(this.baseLayerWidgets, args.layer.id);
            }
        },
        /** Keep the selected button consistent across layer Items.
         * @param {string} - name - The name of the layer added to the map.
         */
        _syncSelectedWithUi: function (layerItems, name) {
            console.log('layer-selector:_syncSelectedWithUi', arguments);

            array.forEach(layerItems, function updateSelected(item) {
                if (item.name !== name) {
                    item.set('selected', false);
                }
            });
        },
        /** polyfill array.find from MDN. */
        _polyfill: function () {
            console.log('layer-selector:_polyfill', arguments);
            if (!Array.prototype.find) {
                /* jshint -W121 */
                Array.prototype.find = function (predicate) {
                    /* jshint +W121 */
                    if (this === null) {
                        throw new TypeError('Array.prototype.find called on null or undefined');
                    }
                    if (typeof predicate !== 'function') {
                        throw new TypeError('predicate must be a function');
                    }
                    var list = Object(this);
                    /* jshint -W016 */
                    var length = list.length >>> 0;
                    /* jshint +W016 */
                    var thisArg = arguments[1];
                    var value;

                    for (var i = 0; i < length; i++) {
                        value = list[i];
                        if (predicate.call(thisArg, value, i, list)) {
                            return value;
                        }
                    }
                    return undefined;
                };
            }
        },
        /** Hides and shows the form containing the layer list. */
        _expand: function () {
            console.log('layer-selector:_expand', arguments);

            domClass.remove(this.layerContainer, this.baseClass + '-hidden');
            domClass.add(this.toggler, this.baseClass + '-hidden');
        },
        /** Hides and shows the form containing the layer list. */
        _collapse: function () {
            console.log('layer-selector:_collapse', arguments);

            domClass.add(this.layerContainer, this.baseClass + '-hidden');
            domClass.remove(this.toggler, this.baseClass + '-hidden');
        },
        /** Override startup to call startup on child widgets. */
        startup: function () {
            console.log('layer-selector:startup', arguments);

            array.forEach(this.baseLayerWidgets, function startupChildren(child) {
                child.startup();
            });
            array.forEach(this.overlayWidgets, function startupChildren(child) {
                child.startup();
            });

            this.inherited(arguments);
        }
    });
});
