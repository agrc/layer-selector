define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!./templates/LayerSelector.html',
    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/_base/lang',

    'esri/layers/TileInfo',
    'esri/layers/WebTiledLayer',

    './LayerSelectorItem'
], function (
    _TemplatedMixin,
    _WidgetBase,

    domClass,
    domConstruct,
    template,
    array,
    declare,
    lang,

    TileInfo,
    WebTiledLayer,

    LayerSelectorItem
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        /**
         * @private
         * @const
         * @property {string} templateString - The class' html `templateString`.
         */
        templateString: template,
        /**
         * @const
         * @private
         * @default layer-selector
         * @property {string} baseClass - The class' css `baseClass` name.
         */
        baseClass: 'layer-selector',
        /**
         * @name baseLayerLayers
         * @memberof LayerSelector
         * @since 0.2.0
         * @prop {esri/layer[]} baselayerLayers - A list of basemap layers that have been created.
         * There is no guarantee that this list will match what was passed into `baselayers` in
         * the constructor. It is a list of baselayers that have been created and added to the `map`
         * at one point or another.
         * @example
         * this.get('baseLayerLayers');
         */
        _getBaselayerLayersAttr: function baseLayers() {
            var layers = this.get('managedLayers');
            return Object.keys(layers).filter(function filterOutBaseLayers(layer) {
                return layers[layer].layerType === 'baselayer';
            });
        },
        /**
         * @name visibleLayers
         * @memberof LayerSelector
         * @since 0.2.0
         * @prop {visibleLayers} visibleLayers - An object containting array's of visible `LayerSelectorItems` widgets
         * and `esri/layer` layers that are currently visible in the map.
         * @example
         * this.get('baseLayerLayers');
         */
        _getVisibleLayersAttr: function baseLayers() {
            var layers = this.get('managedLayers');

            var visibleLayerWidgets = this.baseLayerWidgets.filter(function findVisibleBaseLayers(widget) {
                return widget.get('selected');
            });

            if (this._hasLinkedLayers) {
                var linked = [];
                array.forEach(visibleLayerWidgets, function mergeArrays(item) {
                    linked = linked.concat(item.layerFactory.linked);
                });

                if (linked.length < 1) {
                    return {
                        widgets: visibleLayerWidgets,
                        layers: array.map(visibleLayerWidgets, function findLayer(widget) {
                            return layers[widget.name].layer;
                        })
                    };
                }

                linked = array.filter(this.overlayWidgets, function filterWidgets(widget) {
                    return linked.indexOf(widget.name) > -1 && widget.get('selected');
                });

                visibleLayerWidgets = visibleLayerWidgets.concat(linked);
            }

            return {
                widgets: visibleLayerWidgets,
                layers: array.map(visibleLayerWidgets, function findLayer(widget) {
                    return layers[widget.name].layer;
                })
            };
        },
        /**
         * @name overlayLayers
         * @memberof LayerSelector
         * @since 0.2.0
         * @prop {esri/layer[]} overlayLayers - A list of overlay layers that have been created.
         * There is no guarantee that this list will match what was passed into `overlayers` in
         * the constructor. It is a list of overlayers that have been created and added to the `map`
         * at one point or another.
         * this.get('overlayLayers');
         */
        _getOverlayLayersAttr: function overlayers() {
            var layers = this.get('managedLayers');
            return Object.keys(layers).filter(function filterOutOverLayers(layer) {
                return layers[layer].layerType === 'overlayer';
            });
        },
        /**
         * @memberof LayerSelector
         * @prop {LayerSelectorItem[]} baseLayerWidgets - The constructed `LayerSelectorItem` widgets.
         */
        baseLayerWidgets: null,
        /**
         * @memberof LayerSelector
         * @prop {LayerSelectorItem[]} overlayWidgets - The constructed `LayerSelectorItem` widgets.
         */
        overlayWidgets: null,
        /**
         * @const
         * @private
         * @property {object} _applianceLayers - The default layers hosted in the appliance.
         */
        _applianceLayers: {
            'Imagery': {
                urlPattern: 'https://discover.agrc.utah.gov/login/path/{quad}/tiles/utah/${level}/${col}/${row}'
            },
            'Topo': {
                urlPattern: 'https://discover.agrc.utah.gov/login/path/{quad}/tiles/topo_basemap/${level}/${col}/${row}'
            },
            'Lite': {
                urlPattern: 'https://discover.agrc.utah.gov/login/path/{quad}/tiles/lite_basemap/${level}/${col}/${row}'
            },
            'Color IR': {
                urlPattern: 'https://discover.agrc.utah.gov/login/path/{quad}/tiles/naip_2011_nrg/${level}/${col}/${row}'
            },
            'Hybrid': {
                urlPattern: 'https://discover.agrc.utah.gov/login/path/{quad}/tiles/utah/${level}/${col}/${row}',
                linked: ['Overlay']
            },
            'Overlay': {
                urlPattern: 'https://discover.agrc.utah.gov/login/path/{quad}/tiles/overlay_basemap/${level}/${col}/${row}'
            }
        },
        /**
         * @private
         * @property {object} _defaultTileInfo  - The default constructor parameter object to create
         *  an `esri/layer/TileInfo` for appliance layers.
         */
        _defaultTileInfo: null,
        /**
         * @private
         * @property {boolean} _hasLinkedLayers - True if any of the `baseLayers` have linked `overlays`.
         */
        _hasLinkedLayers: false,

        /**
         * A class for creating a layer selector that changes layers for a given map.
         * @name LayerSelector
         * @param {HTMLElement|string} [node] - The domNode or string id of a domNode to create this widget on. If null
         * a new div will be created but not placed in the dom. You will need to place it programmatically.
         * @param params {object}
         * @param {esri/map | agrc/widgets/map/BaseMap} params.map - The map to control layer selection within.
         * @param {layerFactory[]} params.baseLayers - mutually exclusive layers (only one can be visible on your map).
         * @param {layerFactory[]} [params.overlays] - layers you display over the `baseLayers`.
         * @param {string} [params.quadWord] - The four word authentication token acquired from the appliance.
         * @param {string} [params.separator=<hr class="layer-selector-separator" />] - An HTML fragment used to
         * separate baselayers from overlays.
         * @param {boolean} [params.top=true] - True if the widget should be placed in the top of the container.
         * @param {boolean} [params.right=true] - True if the widget should be placed in the right of the container.
         */
        constructor: function (params) {
            console.log('layer-selector::constructor', arguments);

            // check for map
            if (!params.map) {
                throw new Error('layer-selector::Missing map in constructor args. `new LayerSelector({map: map});`');
            }

            this._defaultTileInfo = this._createDefaultTileInfo();
            // params.map.lods = this._defaultTileInfo.lods;
            this._applianceLayers = this._setTileInfosForApplianceLayers(this._applianceLayers);
        },
        /**
         * This is fired after all properties of a widget are defined, and the document fragment representing the
         * widget is created—but before the fragment itself is added to the main document.
         * @private */
        postCreate: function () {
            console.log('layer-selector::postCreate', arguments);

            this._setupConnections();
            this._polyfill();

            this.inherited(arguments);

            if (!this.baseLayers || this.baseLayers.length < 1) {
                domClass.add(this.domNode, this.baseClass + '-hidden');
                console.warn('layer-selector::`baseLayers` is null or empty. Make sure you have spelled it correctly ' +
                             'and are passing it into the constructor of this widget.');
                return;
            }

            var top = this.top != null ? this.top : true;
            var right = this.right != null ? this.top : true;

            var locations = {
                top: top,
                right: right
            };

            this._placeWidget(locations, this.domNode, this.map.root, this.baseClass);

            this._buildUi(this.baseLayers || [], this.overlays || [], this.quadWord, this.separator || '<hr class="layer-selector-separator" />');
        },
        /**
         * wire events, and such
         * @private
         */
        _setupConnections: function () {
            console.log('layer-selector::_setupConnections', arguments);

        },
        /**
         * Takes the `baseLayers` and `overlays` and creates the UI markup.
         * @private
         * @param {layerFactory[]} baseLayers - mutually exclusive layers (only one can be visible on your map).
         * @param {layerFactory[]} overlays - layers you display over the `baseLayers`.
         * @param {string} [quadWord] - The four word authentication token acquired from the appliance.
         * @param {string} separator - An HTML fragment used to separate baselayers from overlays.
         */
        _buildUi: function (baseLayers, overlays, quadWord, separator) {
            console.log('layer-selector:_buildUi', arguments);

            baseLayers = this._resolveBasemapTokens(baseLayers, quadWord);
            overlays = this._resolveBasemapTokens(overlays, quadWord);

            this._hasLinkedLayers = baseLayers && baseLayers.some(function checkForLinked(layerFactory) {
                return layerFactory.linked;
            });

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
                console.warn('layer-selector::`baseLayers` has no visible layers and `overlays` is null or empty. ' +
                             'This widget will be hidden since it will serve no purpose. Reconsider using it at all.');
            }

            this._selectLayerElements(overlays, this.overlayWidgets, false);
            this._selectLayerElements(baseLayers, this.baseLayerWidgets, true);

            if (visibleBaseLayers.length > 0 && this.overlayWidgets.length > 0) {
                domConstruct.place(separator, this.layerContainer, this.baseLayerWidgets.length);
            }
        },
        /**
         * Places the `node` inside the `refNode`, applying CSS classes to align itself using constructor parameters
         * `top` and `right`.
         * @private
         * @param {object} locations - contains a  boolean `top` and `right` property for determining
         * which corner to place the widget.
         * @param {HTMLElement} node - the root node of the widget.
         * @param {HTMLElement} refNode - the reference node for placing the widget.
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
        /**
         * Takes layer tokens from `_applianceLayers` keys and resolves them to `layerFactory` objects with
         * `esri/layer/WebTiledLayer` factories.
         * @private
         * @param {string[]|layerFactory[]} layerFactories - An array of layer tokens or layer factories.
         * @returns {layerFactory[]} an array of resolved layer factory objects.
         */
        _resolveBasemapTokens: function (layerFactories) {
            console.log('layer-selector:_resolveBasemapTokens', arguments);

            var resolvedInfos = [];
            array.forEach(layerFactories, function resolveToken(li) {
                if (typeof li === 'string' || li instanceof String || li.token &&
                   (typeof li.token === 'string' || li.token instanceof String)) {

                    var id = (li.token || li);

                    if (!this.quadWord) {
                        console.warn('layer-selector::You chose to use a layer token `' + id + '` without setting ' +
                                     'your `quadWord` from the appliance. The requests for tiles will fail to ' +
                                     ' authenticate. Pass `quadWord` into the constructor of this widget.');
                        return false;
                    }

                    var layer = this._applianceLayers[id];

                    if (!layer) {
                        console.warn('layer-selector::The layer token `' + id + '` was not found. Please use one of ' +
                                     'the supported tokens (' + Object.keys(this._applianceLayers).join(', ') +
                                     ') or pass in the information on how to create your custom layer ' +
                                     '(`{factory, url, id}`).');
                        return false;
                    }

                    var tileInfo = null;
                    if (layer.tileInfo) {
                        tileInfo = new TileInfo(layer.tileInfo);
                    }

                    resolvedInfos.push({
                        factory: WebTiledLayer,
                        url: layer.urlPattern.replace('{quad}', this.quadWord),
                        linked: layer.linked,
                        id: id,
                        tileInfo: tileInfo,
                        selected: li.selected
                    });
                } else {
                    resolvedInfos.push(li);
                }
            }, this);

            return resolvedInfos;
        },
        /**
         * Takes the `layerFactory`, creates new `LayerSelectorItems`, and places them in the `container`.
         * @private
         * @param {layerFactory[]} layerFactory - layer infos as passed via `baseLayers` or `overlays`
         * @param {HTMLElement} container - the dom node to hold the created elements.
         * @param {string} type - `radio` or `checkbox`.
         * @returns {LayerSelectorItem[]} - The widgets created from the `layerFactory`.
         */
        _buildLayerItemWidgets: function (layerFactory, container, type) {
            console.log('layer-selector:_buildLayerItemWidgets', arguments);

            if (!layerFactory || !layerFactory.length) {
                return [];
            }

            var widgets = [];
            layerFactory.forEach(function addToContainer(li) {
                var item = new LayerSelectorItem({
                    layerFactory: li,
                    inputType: type
                }).placeAt(container);

                this.own(
                    item.on('changed', lang.hitch(this, '_updateMap')),
                    item
                );

                widgets.push(item);
            }, this);

            return widgets;
        },
        /**
         * Checks the radio box or checkbox for the created `LayerSelectorItem`'s.
         * @private
         * @param {layerFactory[]} layerFactories - layers to be added to the selector.
         * @param {LayerSelectorItem[]} widgets - the html representation of the layer.
         * @param {boolean} firstOnly - only select the first item. Or select them all.
         */
        _selectLayerElements: function (layerFactories, widgets, firstOnly) {
            console.log('layer-selector:_selectLayerElements', arguments);

            if (!layerFactories || !layerFactories.length) {
                return;
            }

            if (firstOnly) {
                var selectedIndex = -1;
                var found = layerFactories.find(function findSelected(layer, i) {
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

            array.forEach(layerFactories, function findSelected(layer, i) {
                if (layer.selected) {
                    widgets[i].set('selected', true);
                }
            });
        },
        /**
         * Takes a `LayerSelectorItem` and makes it visible in the `map`.
         * @private
         * @param {LayerSelectorItem} layerItem - item that was changed
         */
        _updateMap: function (layerItem) {
            console.log('layer-selector:_updateMap', arguments);

            var managedLayers = this.get('managedLayers') || {};

            if (layerItem.get('selected') === false) {
                var managedLayer = managedLayers[layerItem.name] || {};
                if (!managedLayer.layer) {
                    managedLayer.layer = this.map.getLayer(layerItem.name);
                }

                if (managedLayer.layer) {
                    this.map.removeLayer(managedLayer.layer);
                }

                return;
            }

            if (Object.keys(managedLayers).indexOf(layerItem.name) < 0) {
                managedLayers[layerItem.name] = {
                    layerType: layerItem.layerType
                };
            }

            this.set('managedLayers', managedLayers);

            if (!managedLayers[layerItem.name].layer) {
                managedLayers[layerItem.name].layer = new layerItem.layerFactory.factory(layerItem.layerFactory.url, layerItem.layerFactory);
            }

            var index = this._determineLayerIndex(layerItem, this.get('managedLayers'), this.map.layerIds, this.map.graphicsLayerIds);

            if (layerItem.get('selected') === true) {
                var tileInfo = managedLayers[layerItem.name].layer.tileInfo;
                var level = this.map.getLevel();

                if (tileInfo) {
                    this.map.__tileInfo = tileInfo;
                    this.map._params.minZoom = this.map.__tileInfo.lods[0].level;
                    this.map._params.maxZoom = this.map.__tileInfo.lods[this.map.__tileInfo.lods.length - 1].level;
                    this.map._params.minScale = this.map.__tileInfo.lods[0].scale;
                    this.map._params.maxScale = this.map.__tileInfo.lods[this.map.__tileInfo.lods.length - 1].scale;

                    if (this.map._params.maxZoom < level) {
                        this.map.setLevel(this.map._params.maxZoom);
                    }
                }

                this.map.addLayer(managedLayers[layerItem.name].layer, index);

                if (level > -1) {
                    this.map._simpleSliderZoomHandler(null, null, null, level);
                }
            } else {
                this.map.removeLayer(managedLayers[layerItem.name].layer);
            }

            if (layerItem.layerType === 'baselayer') {
                this._syncSelectedWithUi(layerItem.name);
            }
        },
        /**
         * Takes the layer and determines the index of which to insert into the map.
         * @private
         * @param {LayerSelectorItem} layerItem - The item containing the name and type of the layer
         * @param {object} managedLayers - An object containing a reference to the layers managed by this widget
         * @param {string[]} layerIds - An array of the layer ids for the map
         * @param {string[]} graphicLayerIds - An array of the graphics layer ids for the map
         * @returns {number} The index of the map to put the layer.
         */
        _determineLayerIndex: function (layerItem, managedLayers, layerIds, graphicLayerIds) {
            console.log('layer-selector:_determineLayerIndex', arguments);

            if (layerItem.layerType === 'baselayer') {
                return 0;
            }

            var layerType = managedLayers[layerItem.name].layer.declaredClass;

            if (layerType === 'esri.layers.FeatureLayer') {
                if (!graphicLayerIds || graphicLayerIds.length === 0) {
                    return 0;
                }

                return array.filter(Object.keys(managedLayers), function countVisibleGraphicOverlayers(key) {
                    return graphicLayerIds.indexOf(key) > -1;
                }).length;
            } else {
                if (!layerIds || layerIds.length === 0) {
                    return 0;
                }

                return array.filter(Object.keys(managedLayers), function countVisibleBaselayers(key) {
                    return layerIds.indexOf(key) > -1;
                }).length;
            }

            return 0;
        },
        /**
         * Keep the selected radio buttons and checkboxes synchonized with the dom across `LayerSelectorItems`.
         * @private
         * @param {string} id - The id of the layer added to the map.
         */
        _syncSelectedWithUi: function (id) {
            console.log('layer-selector:_syncSelectedWithUi', arguments);

            // turn off all other base layers
            var baseWidget;
            array.forEach(this.baseLayerWidgets, function updateSelected(item) {
                if (item.name !== id) {
                    item.set('selected', false);
                } else {
                    baseWidget = item;
                }
            });

            // toggle overlays based on linked only if there is a baselayer with a linked property
            if (this._hasLinkedLayers) {
                var linked = baseWidget.layerFactory.linked || [];
                array.forEach(this.overlayWidgets, function updateSelected(item) {
                    item.set('selected', linked.indexOf(item.name) > -1);
                });
            }
        },
        /**
         * polyfill older browsers with array.find and object.keys from MDN.
         * @private
         */
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

            if (!Object.keys) {
                Object.keys = (function () {
                    'use strict';
                    var hasOwnProperty = Object.prototype.hasOwnProperty;
                    var hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString');
                    var dontEnums = [
                          'toString',
                          'toLocaleString',
                          'valueOf',
                          'hasOwnProperty',
                          'isPrototypeOf',
                          'propertyIsEnumerable',
                          'constructor'
                      ];
                    var dontEnumsLength = dontEnums.length;

                    return function (obj) {
                        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                            throw new TypeError('Object.keys called on non-object');
                        }

                        var result = [];
                        var prop;
                        var i;

                        for (prop in obj) {
                            if (hasOwnProperty.call(obj, prop)) {
                                result.push(prop);
                            }
                        }

                        if (hasDontEnumBug) {
                            for (i = 0; i < dontEnumsLength; i++) {
                                if (hasOwnProperty.call(obj, dontEnums[i])) {
                                    result.push(dontEnums[i]);
                                }
                            }
                        }
                        return result;
                    };
                }());
            }
        },
        /**
         * Creates the default TileInfo constructor object for applicance layers.
         * @private
         * @returns {object} The least common denominator contructor object for appliance layers.
         */
        _createDefaultTileInfo: function () {
            console.log('layer-selector:_createDefaultTileInfo', arguments);

            var tilesize = 256;
            var earthCircumference = 40075016.685568;
            var halfEarthCircumference = halfEarthCircumference * 0.5;
            var inchesPerMeter =  39.37;
            var initialResolution = earthCircumference / tilesize;

            var lods = [];
            for (var level = 0; level <= 20; level++) {
                var resolution = initialResolution / Math.pow(2, level);
                var scale = resolution * 96 * inchesPerMeter;
                lods.push({
                    level: level,
                    scale: scale,
                    resolution: resolution
                });
            }

            return {
                dpi: 96,
                rows: 256,
                cols: 256,
                width: 256,
                origin: {
                    x: -20037508.342787,
                    y: 20037508.342787
                },
                spatialReference: {
                    wkid: 3857
                },
                lods: lods
            };
        },
        /** Sets the TileInfo for each of the appliance layers since they all use different levels.
         * @private
         * @param {applianceLayer} layers - The applicance layers object `{ 'id': { urlPattern: ''}}`
         * @returns {applianceLayer} - returns the appliance layers object with a new `tileInfo` property.
         */
        _setTileInfosForApplianceLayers: function (layers) {
             console.log('layer-selector:_setTileInfosForApplianceLayers', arguments);

             var lods = this._defaultTileInfo.lods;
             var fiveToNineteen = lods.slice(0, 20);
             var fiveToSeventeen = lods.slice(0, 18);
             var zeroToEighteen = lods.slice(0, 19);

             layers.Imagery.tileInfo = new TileInfo(this._defaultTileInfo);
             layers.Hybrid.tileInfo = new TileInfo(this._defaultTileInfo);

             var tileInfo = lang.clone(this._defaultTileInfo);
             tileInfo.lods = zeroToEighteen;

             layers['Color IR'].tileInfo = new TileInfo(tileInfo);

             tileInfo = lang.clone(this._defaultTileInfo);
             tileInfo.lods = fiveToSeventeen;

             layers.Topo.tileInfo = new TileInfo(tileInfo);

             tileInfo = lang.clone(this._defaultTileInfo);
             tileInfo.lods = fiveToNineteen;

             layers.Lite.tileInfo = new TileInfo(tileInfo);
             layers.Overlay.tileInfo = new TileInfo(tileInfo);

             return layers;
         },
        /**
         * Shows the form containing the layer list.
         * @private
         */
        _expand: function () {
            console.log('layer-selector:_expand', arguments);

            domClass.remove(this.layerContainer, this.baseClass + '-hidden');
            domClass.add(this.toggler, this.baseClass + '-hidden');
        },
        /**
         * Hides the form containing the layer list.
         * @private
         */
        _collapse: function () {
            console.log('layer-selector:_collapse', arguments);

            domClass.add(this.layerContainer, this.baseClass + '-hidden');
            domClass.remove(this.toggler, this.baseClass + '-hidden');
        },
        /**
         * We have overriden startup on `_WidgetBase` to call startup on all `LayerSelectorItem` child widgets.
         * You should always call startup on this widget after it has been placed in the dom.
         */
        startup: function () {
            console.log('layer-selector:startup', arguments);

            var startup = function (child) {
                child.startup();
            };
            array.forEach(this.baseLayerWidgets, startup);
            array.forEach(this.overlayWidgets, startup);

            this.inherited(arguments);
        }
    });
});
/**
 * The info about a layer needed to create it and show it on a map and in the layer selector successfully.
 * @typedef {object} layerFactory
 * @property {function} factory - the constructor function for creating a layer.
 * @property {string} url - The url to the map service.
 * @property {string} id - The id of the layer. This is shown in the LayerSelectorItem.
 * @property {object} tileInfo - The `esri/TileInfo` object if the layer has custom levels.
 * @property {string[]} linked - The id of overlays to automatically enable when selected.
 */
/**
 * The return value of the `visibleLayers` property.
 * @typedef {object} visibleLayers
 * @property {LayerSelectorItem[]} widgets - The visible `LayerSelectorItems`.
 * @property {esri/layer[]} layers - The visible `esri/layer/*`.
 */
