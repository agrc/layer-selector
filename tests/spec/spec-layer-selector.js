require([
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/query',

    'layer-selector'
], function (
    domClass,
    domConstruct,
    query,

    WidgetUnderTest
) {
    describe('layer-selector', function () {
        var widget;
        var map;

        var destroy = function (widget) {
            widget.destroyRecursive();
            widget = null;
            try {
                document.body.removeChild(map.root);
            } catch (e) {

            }
        };

        var visible = function (layer) {
            return !domClass.contains(layer.parentNode, 'layer-selector-hidden');
        };

        var checked = function (input) {
            return input.checked;
        };

        beforeEach(function () {
            map = {
                root: domConstruct.create('div', null, document.body),
                getLayer: function () {
                    return {
                        suspend: function () {},
                        resume: function () {}
                    };
                },
                addLayer: function () {}
            };
        });

        afterEach(function () {
            if (widget) {
                destroy(widget);
            }
        });

        describe('Sanity', function () {
            it('should create a layer-selector', function () {
                widget = new WidgetUnderTest({map: map});
                widget.startup();

                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });

        describe('constructor', function () {
            it('sets hasLinked appropriately', function () {
                widget = new WidgetUnderTest({
                    map: map,
                    baseLayers: [{
                        name: 'blah'
                    }, {
                        name: 'blah2',
                        linked: ['blah3']
                    }]
                });

                expect(widget.hasLinked).toBe(true, 'linked layers');

                destroy(widget);

                widget = new WidgetUnderTest({
                    map: map,
                    baseLayers: [{
                        name: 'blah'
                    }, {
                        name: 'blah2'
                    }]
                });

                expect(widget.hasLinked).toBe(false, 'no linked layers');
            });
        });
        describe('UI', function () {
            it('It should not display separator if there are 1 base layer and > 0 overlays', function () {
                widget = new WidgetUnderTest({
                    map: map,
                    baseLayers: [{
                        name: '1'
                    }],
                    overlays: [{
                        name: 'graphics layer!'
                    }]
                });
                widget.startup();

                var baseLayers = query('[name="base-layer"]', widget.layerContainer);
                var overlays = query('[name="over-layer"]', widget.layerContainer);

                var visibleBaseLayers = baseLayers.filter(visible);
                var visibleOverlays = overlays.filter(visible);

                expect(visibleBaseLayers.length).toEqual(0, 'should not be any visible base-layers');

                expect(visibleOverlays.length).toEqual(1, 'all overlayers should be visible');
                expect(query('hr', widget.layerContainer).length).toEqual(0, 'no separator should be visible');
            });
            it('It should add separator if there > 1 base layer and > 0 overlays', function () {
                widget = new WidgetUnderTest({
                    map: map,
                    baseLayers: [{
                        name: '1'
                    }, {
                        name: '2'
                    }],
                    overlays: [{
                        name: 'graphics layer!'
                    }]
                });
                widget.startup();

                var baseLayers = query('[name="base-layer"]', widget.layerContainer);
                var overlays = query('[name="over-layer"]', widget.layerContainer);

                var visibleBaseLayers = baseLayers.filter(visible);
                var visibleOverlays = overlays.filter(visible);

                expect(visibleBaseLayers.length).toEqual(2, 'basemaps should both be visible');
                expect(visibleOverlays.length).toEqual(1, 'overlay should always be visible');
                expect(query('hr', widget.layerContainer).length).toEqual(1, 'there shoudl be a separator');
            });
            it('It should not display separator if there are no overlays', function () {
                widget = new WidgetUnderTest({
                    map: map,
                    baseLayers: [{
                        name: '1'
                    }, {
                        name: '2'
                    }]
                });
                widget.startup();

                var baseLayers = query('[name="base-layer"]', widget.layerContainer);
                var overlays = query('[name="over-layer"]', widget.layerContainer);

                var visibleBaseLayers = baseLayers.filter(visible);
                var visibleOverlays = overlays.filter(visible);

                expect(visibleBaseLayers.length).toEqual(2, 'both basemaps shoudl be visible');
                expect(visibleOverlays.length).toEqual(0, 'there are no overlays');
                expect(query('hr', widget.layerContainer).length).toEqual(0, 'no separator should be shown');
            });
            it('It should not display at all if there are 1 baselayer and no overlays', function () {
                widget = new WidgetUnderTest({
                    map: map,
                    baseLayers: [{
                        name: 'only 1'
                    }]
                });
                widget.startup();

                expect(domClass.contains(widget.domNode, 'layer-selector-hidden')).toEqual(true, 'widget should be hidden');
            });
            it('It should not display at all if there are no baselayer and no overlays', function () {
                widget = new WidgetUnderTest({
                    map: map
                });
                widget.startup();

                expect(domClass.contains(widget.domNode, 'layer-selector-hidden')).toEqual(true, 'widget should be hidden');
            });
            describe('baseLayers', function () {
                it('should select first item in list if no property selected:true found', function () {
                    widget = new WidgetUnderTest({
                        map: map,
                        baseLayers: [{
                            name: 'i am checked'
                        }, {
                            name: 'i am not checked'
                        }]
                    });
                    widget.startup();

                    var nodeList = query('input:checked', widget.domNode);
                    expect(nodeList.length).toEqual(1, 'first base layer should be checked');
                    expect(nodeList[0].value).toEqual('i am checked', 'value should match first baselayer');
                });
                it('should select first item with property selected:true found', function () {
                    widget = new WidgetUnderTest({
                        map: map,
                        baseLayers: [{
                            name: 'i am not checked'
                        }, {
                            name: 'i am also not checked'
                        }, {
                            name: 'i am checked',
                            selected: true
                        }, {
                            name: 'i am also checked',
                            selected: true
                        }]
                    });
                    widget.startup();

                    var nodeList = query('input:checked', widget.domNode);
                    expect(nodeList.length).toEqual(1, 'first selected item should be checked');
                    expect(nodeList[0].value).toEqual('i am checked', 'should match first selected item');
                });
                it('should uncheck overlays when baselayer is active and linked is empty', function () {
                    widget = new WidgetUnderTest({
                        map: map,
                        baseLayers: [{
                            name: 'i am checked',
                            factory: function () {},
                            selected: true
                        }, {
                            name: 'i am not checked',
                            factory: function () {},
                            linked: ['i was checked']
                        }],
                        overlays: [{
                            name: 'i was checked',
                            factory: function () {},
                            selected: true
                        }, {
                            name: 'i was also checked',
                            factory: function () {},
                            selected: true
                        }]
                    });
                    widget.startup();

                    var nodeList = query('input[name="over-layer"]', widget.domNode);
                    var checkedInputs = nodeList.filter(checked);

                    expect(checkedInputs.length).toEqual(0, 'base layers with no link should unselect overlays');
                });
                it('should check overlays when baselayer is active and has linked[name]', function () {
                    widget = new WidgetUnderTest({
                        map: map,
                        baseLayers: [{
                            name: 'i am checked',
                            linked: ['i am checked']
                        }, {
                            name: 'i am not checked'
                        }],
                        overlays: [{
                            name: 'i am checked',
                            selected: true
                        }, {
                            name: 'i was also checked',
                            selected: true
                        }]
                    });
                    widget.startup();

                    var nodeList = query('input[name="over-layer"]', widget.domNode);
                    var checkedInputs = nodeList.filter(checked);

                    expect(checkedInputs.length).toEqual(1, 'linked should only be checked.');
                });
            });
            describe('overlays', function () {
                it('should check all items with selected:true', function () {
                    widget = new WidgetUnderTest({
                        map: map,
                        baseLayers: [{
                            name: 'ignore me'
                        }],
                        overlays: [{
                            name: 'i am not checked'
                        }, {
                            name: 'i am also not checked'
                        }, {
                            name: 'i am checked',
                            selected: true
                        }, {
                            name: 'i am also checked',
                            selected: true
                        }]
                    });
                    widget.startup();

                    var nodeList = query('input[name="over-layer"]', widget.domNode);
                    var checkedInputs = nodeList.filter(checked);

                    expect(checkedInputs.length).toEqual(2);
                });
                it('should check no overlays if none are selected', function () {
                    widget = new WidgetUnderTest({
                        map: map,
                        baseLayers: [{
                            name: 'ignore me'
                        }],
                        overlays: [{
                            name: 'i am not checked'
                        }, {
                            name: 'i am also not checked'
                        }, {
                            name: 'i am checked'
                        }, {
                            name: 'i am also checked'
                        }]
                    });
                    widget.startup();

                    var nodeList = query('input[name="over-layer"]', widget.domNode);
                    var checkedInputs = nodeList.filter(checked);

                    expect(checkedInputs.length).toEqual(0);
                });
            });
        });
    });
});
