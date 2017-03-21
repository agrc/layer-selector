require([
    'layer-selector/LayerSelectorItem',

    'dojo/dom-construct'
], function (
    WidgetUnderTest,

    domConstruct
) {
    describe('layer-selector/layer-selector-item', function () {
        var widget;
        var destroy = function (item) {
            item.destroyRecursive();
            item = null;
        };

        beforeEach(function () {
            widget = new WidgetUnderTest(null, domConstruct.create('div', null, document.body));
            widget.startup();
        });

        afterEach(function () {
            if (widget) {
                destroy(widget);
            }
        });

        describe('Sanity', function () {
            it('should create a layer-selector-item', function () {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });
        describe('_setupConnections', function () {
            it('should fire selected event', function () {
                var fired;
                widget.on('changed', function () {
                    fired = true;
                });

                widget.input.click();

                expect(fired).toBe(true);
            });
        });
    });
});
