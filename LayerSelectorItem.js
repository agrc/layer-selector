/** @class */
define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/dom-attr',
    'dojo/dom-class',
    'dojo/on',
    'dojo/text!./templates/LayerSelectorItem.html',
    'dojo/_base/declare',
    'dojo/_base/lang'
], function (
    _TemplatedMixin,
    _WidgetBase,

    domAttr,
    domClass,
    on,
    template,
    declare,
    lang
) {
    return declare([_WidgetBase, _TemplatedMixin], /** @lends layer-selector/LayerSelectorItem# */ {
        /**
         * @const
         * @property {string} - The class' html `templateString`.
         */
        templateString: template,
        /**
         * @const
         * @default layer-selector-item
         * @property {string} - The class' css `baseClass` name.
         */
        baseClass: 'layer-selector-item',
        /**
         * @property {object} - _WidgetBase custom setter for setting the checkbox on an input.
         * @example this.set('selected', true);
         */
        _setSelectedAttr: {
            node: 'input',
            type: 'attribute',
            attribute: 'checked'
        },
        /**
         * @default false
         * @property {bool} - True if the widget is currently hidden.
         */
        hidden: false,
        /**
         * @property {function} - _WidgetBase custom setter for setting the css class on the widget domNode.
         * @example this.set('hidden', true);
         */
        _setHiddenAttr: function (hidden) {
            this._set('hidden', hidden);
            domClass.toggle(this.domNode, 'layer-selector-hidden');
        },
        /** @property {function} - _WidgetBase custom setter for setting the the alt text and label name.
         * We do not always have the name at build rendering time (layer tokens). Therefore the templateString
         * has been modified and the values are updated with this function.
         * @example this.set('layerFactory', {});
         */
        _setLayerFactoryAttr: function (layerFactory) {
            this.name = (layerFactory.id || layerFactory.name || 'unknown');

            domAttr.set(this.label, 'alt', this.name);
            domAttr.set(this.label, 'title', this.name);
            domAttr.set(this.input, 'value', this.name);
            this.label.appendChild(document.createTextNode(this.name));
        },

        /**
         * @property {function} - _WidgetBase custom setter for applying the input type attribute.
         * @default radio
         * @example this.set('inputType', 'radio');
         */
        _setInputTypeAttr: function (inputType) {
            var type = inputType || 'radio';
            this.layerType = type === 'radio' ? 'baselayer' : 'overlayer';

            domAttr.set(this.input, 'type', type);
            domAttr.set(this.input, 'name', this.layerType);

            this._set('inputType', type);
        },

        /**
         * A module representing an item inside a LayerSelector.
         * @constructs
         * @param {layerFactory[]} layerFactory - The factory object representing a layer.
         * @param {string} inputType - `radio` or `checkbox` depending on the type of input.
         */
        postCreate: function () {
            console.log('layer-selector-item::postCreate', arguments);

            domClass.add(this.domNode, ['radio', 'checkbox', 'layer-selector-input']);

            this._setupConnections();

            this.inherited(arguments);
        },
        /** wire events, and such */
        _setupConnections: function () {
            console.log('layer-selector-item::setupConnections', arguments);

            this.watch('selected', lang.hitch(this, function changed() {
                on.emit(this.domNode, 'changed', this);
            }));

            this.own(
                on(this.input, 'click', lang.hitch(this, function changed(e) {
                    this.set('selected', e.target.checked);
                }))
            );
        }
    });
});
