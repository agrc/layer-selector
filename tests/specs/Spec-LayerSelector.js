require([
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/query',

    'esri/Map',
    'esri/views/MapView',

    'layer-selector'
], function (
    domClass,
    domConstruct,
    query,

    Map,
    MapView,

    WidgetUnderTest
) {
    describe('layer-selector', function () {
        var widget;
        var mapView;

        var visible = function (layer) {
            return !domClass.contains(layer.parentNode.parentNode, 'layer-selector-hidden');
        };

        var checked = function (input) {
            return input.checked;
        };

        var noop = function () { };

        beforeEach(function (done) {
            mapView = new MapView({
                map: new Map({ basemap: 'streets' }),
                container: domConstruct.create('div', null, document.body)
            });

            mapView.then(function () {
                console.log('mapView done');
                done();
            });
        });

        afterEach(function (done) {
            if (mapView) {
                // mapView.destroy needs some extra help...
                // https://thespatialcommunity.slack.com/archives/C0A6GD4T0/p1494006356289273
                mapView.allLayerViews.destroy();
                mapView.layerViewManager.empty();
                mapView.ui.empty();
                mapView.container.remove();
                setTimeout(() => {
                    try {
                        console.log('destroying mapView');
                        mapView.destroy();
                        console.log('destroyed');
                    } finally {
                        mapView = null;
                        console.log('done');
                        done();
                    }
                }, 0);
            } else {
                widget.destroy();
            }
        });

        describe('Sanity', function () {
            it('should create a layer-selector', function () {
                widget = new WidgetUnderTest({ mapView: mapView });
                widget.startup();

                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });

        describe('constructor', function () {
            it('sets _hasLinkedLayers appropriately', function () {
                widget = new WidgetUnderTest({
                    mapView: mapView,
                    baseLayers: [{
                        name: 'blah',
                        Factory: noop
                    }, {
                        name: 'blah2',
                        linked: ['blah3'],
                        Factory: noop
                    }]
                });

                expect(widget._hasLinkedLayers).toBe(true, 'linked layers'); // eslint-disable-line no-underscore-dangle

                mapView.destroy();

                widget = new WidgetUnderTest({
                    mapView: mapView,
                    baseLayers: [{
                        name: 'blah',
                        Factory: noop
                    }, {
                        name: 'blah2',
                        Factory: noop
                    }]
                });

                /* eslint-disable no-underscore-dangle */
                expect(widget._hasLinkedLayers).toBe(false, 'no linked layers');
                /* eslint-ensable no-underscore-dangle */
            });
        });

        describe('getters', function () {
            it('visibleLayers gets only visible layers', function () {
                widget = new WidgetUnderTest({
                    mapView: mapView,
                    baseLayers: [{
                        name: '1',
                        Factory: noop
                    }, {
                        name: '2',
                        Factory: noop
                    }]
                });

                expect(widget.get('visibleLayers').widgets.length).toEqual(1, 'one visible layer');
                expect(widget.get('visibleLayers').widgets[0].name).toEqual('1');
            });
            it('visibleLayers gets linked layers', function () {
                widget = new WidgetUnderTest({
                    mapView: mapView,
                    baseLayers: [{
                        name: '1',
                        Factory: noop,
                        linked: ['3', '4']
                    }, {
                        name: '2',
                        Factory: noop
                    }],
                    overlays: [{
                        name: '3'
                    }, {
                        name: '4'
                    }]
                });

                expect(widget.get('visibleLayers').widgets.length)
                    .toEqual(3, 'one visible baselayer and 2 overlays'); // eslint-disable-line no-magic-numbers
                expect(widget.get('visibleLayers').widgets[0].name).toEqual('1');
                expect(widget.get('visibleLayers').widgets[1].name).toEqual('3');
                expect(widget.get('visibleLayers').widgets[2].name).toEqual('4');
            });
        });

        describe('UI', function () {
            it('It should not display separator if there are 1 base layer and > 0 overlays', function () {
                widget = new WidgetUnderTest({
                    mapView: mapView,
                    baseLayers: [{
                        name: '1',
                        Factory: noop
                    }],
                    overlays: [{
                        name: 'graphics layer!',
                        Factory: noop
                    }]
                });
                widget.startup();

                var baseLayers = query('[name="baselayer"]', widget.layerContainer);
                var overlays = query('[name="overlayer"]', widget.layerContainer);

                var visibleBaseLayers = baseLayers.filter(visible);
                var visibleOverlays = overlays.filter(visible);

                expect(visibleBaseLayers.length).toEqual(0, 'should not be any visible baselayers');

                expect(visibleOverlays.length).toEqual(1, 'all overlayers should be visible');
                expect(query('hr', widget.layerContainer).length).toEqual(0, 'no separator should be visible');
            });
            it('It should add separator if there > 1 base layer and > 0 overlays', function () {
                widget = new WidgetUnderTest({
                    mapView: mapView,
                    baseLayers: [{
                        name: '1',
                        Factory: noop
                    }, {
                        name: '2',
                        Factory: noop
                    }],
                    overlays: [{
                        name: 'graphics layer!',
                        Factory: noop
                    }]
                });
                widget.startup();

                var baseLayers = query('[name="baselayer"]', widget.layerContainer);
                var overlays = query('[name="overlayer"]', widget.layerContainer);

                var visibleBaseLayers = baseLayers.filter(visible);
                var visibleOverlays = overlays.filter(visible);

                expect(visibleBaseLayers.length)
                    .toEqual(2, 'basemaps should both be visible'); // eslint-disable-line no-magic-numbers
                expect(visibleOverlays.length).toEqual(1, 'overlay should always be visible');
                expect(query('hr', widget.layerContainer).length).toEqual(1, 'there shoudl be a separator');
            });
            it('It should not display separator if there are no overlays', function () {
                widget = new WidgetUnderTest({
                    mapView: mapView,
                    baseLayers: [{
                        name: '1',
                        Factory: noop
                    }, {
                        name: '2',
                        Factory: noop
                    }]
                });
                widget.startup();

                var baseLayers = query('[name="baselayer"]', widget.layerContainer);
                var overlays = query('[name="overlayer"]', widget.layerContainer);

                var visibleBaseLayers = baseLayers.filter(visible);
                var visibleOverlays = overlays.filter(visible);
                var visibleCount = 2;

                expect(visibleBaseLayers.length).toEqual(visibleCount, 'both basemaps shoudl be visible');
                expect(visibleOverlays.length).toEqual(0, 'there are no overlays');
                expect(query('hr', widget.layerContainer).length).toEqual(0, 'no separator should be shown');
            });
            it('It should not display at all if there are 1 baselayer and no overlays', function () {
                widget = new WidgetUnderTest({
                    mapView: mapView,
                    baseLayers: [{
                        name: 'only 1',
                        Factory: noop
                    }]
                });
                widget.startup();

                expect(domClass.contains(widget.domNode, 'layer-selector-hidden'))
                    .toEqual(true, 'widget should be hidden');
            });
            it('It should not display at all if there are no baselayer and no overlays', function () {
                widget = new WidgetUnderTest({
                    mapView: mapView
                });
                widget.startup();

                expect(domClass.contains(widget.domNode, 'layer-selector-hidden'))
                    .toEqual(true, 'widget should be hidden');
            });
            describe('baseLayers', function () {
                xit('should select first item in list if no property selected:true found', function () {
                    widget = new WidgetUnderTest({
                        mapView: mapView,
                        baseLayers: [{
                            name: 'i am checked',
                            Factory: noop
                        }, {
                            name: 'i am not checked',
                            Factory: noop
                        }]
                    });
                    widget.startup();

                    var nodeList = query('input:checked', widget.domNode);
                    expect(nodeList.length).toEqual(1, 'first base layer should be checked');
                    expect(nodeList[0].value).toEqual('i am checked', 'value should match first baselayer');
                });
                xit('should select first item with property selected:true found', function () {
                    widget = new WidgetUnderTest({
                        mapView: mapView,
                        baseLayers: [{
                            name: 'i am not checked',
                            Factory: noop
                        }, {
                            name: 'i am also not checked',
                            Factory: noop
                        }, {
                            name: 'i am checked',
                            selected: true,
                            Factory: noop
                        }, {
                            name: 'i am also checked',
                            selected: true,
                            Factory: noop
                        }]
                    });
                    widget.startup();

                    var nodeList = query('input:checked', widget.domNode);
                    expect(nodeList.length).toEqual(1, 'first selected item should be checked');
                    expect(nodeList[0].value).toEqual('i am checked', 'should match first selected item');
                });
                xit('should uncheck overlays when baselayer is active and linked is empty', function () {
                    widget = new WidgetUnderTest({
                        mapView: mapView,
                        baseLayers: [{
                            name: 'i am checked',
                            Factory: noop,
                            selected: true
                        }, {
                            name: 'i am not checked',
                            Factory: noop,
                            linked: ['i was checked']
                        }],
                        overlays: [{
                            name: 'i was checked',
                            Factory: noop,
                            selected: true
                        }, {
                            name: 'i was also checked',
                            Factory: noop,
                            selected: true
                        }]
                    });
                    widget.startup();

                    var nodeList = query('input[name="overlayer"]', widget.domNode);
                    var checkedInputs = nodeList.filter(checked);

                    expect(checkedInputs.length).toEqual(0, 'base layers with no link should unselect overlays');
                });
                it('should check overlays when baselayer is active and has linked[name]', function () {
                    widget = new WidgetUnderTest({
                        mapView: mapView,
                        baseLayers: [{
                            name: 'i am checked',
                            Factory: noop,
                            linked: ['i am checked']
                        }, {
                            name: 'i am not checked'
                        }],
                        overlays: [{
                            name: 'i am checked',
                            Factory: noop,
                            selected: true
                        }, {
                            name: 'i was also checked',
                            Factory: noop,
                            selected: true
                        }]
                    });
                    widget.startup();

                    var nodeList = query('input[name="overlayer"]', widget.domNode);
                    var checkedInputs = nodeList.filter(checked);

                    expect(checkedInputs.length).toEqual(1, 'linked should only be checked.');
                });
                it('should check overlays when baselayer is token, active, and has linked[name]', function () {
                    widget = new WidgetUnderTest({
                        mapView: mapView,
                        quadWord: 'quad-word-thing-zing',
                        baseLayers: [{
                            token: 'Lite',
                            linked: ['Overlay']
                        }],
                        overlays: ['Overlay']
                    });
                    widget.startup();

                    var nodeList = query('input[name="overlayer"]', widget.domNode);
                    var checkedInputs = nodeList.filter(checked);

                    expect(checkedInputs.length).toEqual(1, 'linked should only be checked.');
                });
            });
            describe('overlays', function () {
                it('should check all items with selected:true', function () {
                    widget = new WidgetUnderTest({
                        mapView: mapView,
                        baseLayers: [{
                            name: 'ignore me',
                            Factory: noop
                        }],
                        overlays: [{
                            name: 'i am not checked',
                            Factory: noop
                        }, {
                            name: 'i am also not checked',
                            Factory: noop
                        }, {
                            name: 'i am checked',
                            selected: true,
                            Factory: noop
                        }, {
                            name: 'i am also checked',
                            selected: true,
                            Factory: noop
                        }]
                    });
                    widget.startup();

                    var nodeList = query('input[name="overlayer"]', widget.domNode);
                    var checkedInputs = nodeList.filter(checked);

                    expect(checkedInputs.length).toEqual(2); // eslint-disable-line no-magic-numbers
                });
                it('should check no overlays if none are selected', function () {
                    widget = new WidgetUnderTest({
                        mapView: mapView,
                        baseLayers: [{
                            name: 'ignore me',
                            Factory: noop
                        }],
                        overlays: [{
                            name: 'i am not checked',
                            Factory: noop
                        }, {
                            name: 'i am also not checked',
                            Factory: noop
                        }, {
                            name: 'i am checked',
                            Factory: noop
                        }, {
                            name: 'i am also checked',
                            Factory: noop
                        }]
                    });
                    widget.startup();

                    var nodeList = query('input[name="overlayer"]', widget.domNode);
                    var checkedInputs = nodeList.filter(checked);

                    expect(checkedInputs.length).toEqual(0);
                });
            });
        });

        describe('_resolveBasemapTokens', function () {
            it('hybrid is always linked to overlay', function () {
                widget = new WidgetUnderTest({
                    mapView: mapView,
                    quadWord: 'my-quad-word-is'
                });

                var resolved = widget._resolveBasemapTokens(['Hybrid']);

                expect(resolved.length).toEqual(1);
                expect(resolved[0].linked.length).toEqual(1);
                expect(resolved[0].linked).toEqual(['Overlay']);
            });
            it('hybrid with extra link is concatentated with overlay', function () {
                widget = new WidgetUnderTest({
                    mapView: mapView,
                    quadWord: 'my-quad-word-is'
                });

                var linked = ['test', 'concatentated', 'links'];
                var totalLinked = linked.length + 1;

                var resolved = widget._resolveBasemapTokens([{
                    token: 'Hybrid',
                    linked: linked
                }]);

                expect(resolved.length).toEqual(1);
                expect(resolved[0].linked.length).toEqual(totalLinked);
                expect(resolved[0].linked).toEqual(['Overlay'].concat(linked));
            });
            it('is ok with no links', function () {
                widget = new WidgetUnderTest({
                    mapView: mapView,
                    quadWord: 'my-quad-word-is'
                });

                var tokens = ['Lite', 'Topo'];
                var resolved = widget._resolveBasemapTokens(tokens);

                expect(resolved.length).toEqual(tokens.length);
                expect(resolved[0].linked).toEqual(null);
                expect(resolved[1].linked).toEqual(null);
            });
        });

        describe('destroy', function () {
            it('removes all layers from the map', function () {
                var testWidget = new WidgetUnderTest({
                    mapView: mapView
                });
                testWidget.startup();
                testWidget.set('managedLayers', {
                    one: {},
                    two: {},
                    three: {}
                });

                testWidget.destroy();

                expect(mapView.map.layers.length).toBe(0);
            });
        });
    });
});
