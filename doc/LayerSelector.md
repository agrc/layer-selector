# LayerSelector

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:164-175](https://github.com/agrc-widgets/layer-selector/blob/0cd8174c371f65a562eb0bdfd7d92a52fed4f08c/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L164-L175 "Source code on GitHub")

A class for creating a layer selector that changes layers for a given map.

**Parameters**

-   `node` **[HTMLElement or string]** The domNode or string id of a domNode to create this widget on. If null
    a new div will be created but not placed in the dom. You will need to place it programmatically.
-   `params`  {object}
    -   `params.map` **esri/map or agrc/widgets/map/BaseMap** The map to control layer selection within.
    -   `params.baseLayers` **Array&lt;layerFactory&gt;** mutually exclusive layers (only one can be visible on your map).
    -   `params.overlays` **[Array&lt;layerFactory&gt;]** layers you display over the `baseLayers`.
    -   `params.quadWord` **[string]** The four word authentication token acquired from the appliance.
    -   `params.separator` **[string]** An HTML fragment used to
        separate baselayers from overlays. (optional, default `<hr class`)
    -   `params.top` **[boolean]** True if the widget should be placed in the top of the container. (optional, default `true`)
    -   `params.right` **[boolean]** True if the widget should be placed in the right of the container. (optional, default `true`)

## baseLayerLayers

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:80-85](https://github.com/agrc-widgets/layer-selector/blob/0cd8174c371f65a562eb0bdfd7d92a52fed4f08c/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L80-L85 "Source code on GitHub")

**Properties**

-   `baselayerLayers` **Array&lt;esri/layer&gt;** A list of basemap layers that have been created.
    There is no guarantee that this list will match what was passed into `baselayers` in
    the constructor. It is a list of baselayers that have been created and added to the `map`
    at one point or another.

**Examples**

```javascript
this.get('baseLayerLayers');
```

## baseLayerLayers

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:56-69](https://github.com/agrc-widgets/layer-selector/blob/0cd8174c371f65a562eb0bdfd7d92a52fed4f08c/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L56-L69 "Source code on GitHub")

**Properties**

-   `baselayerLayers` **Array&lt;esri/layer&gt;** A list of basemap layers that have been created.
    There is no guarantee that this list will match what was passed into `baselayers` in
    the constructor. It is a list of baselayers that have been created and added to the `map`
    at one point or another.

**Examples**

```javascript
this.get('baseLayerLayers');
```

## baseLayerWidgets

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:105-105](https://github.com/agrc-widgets/layer-selector/blob/0cd8174c371f65a562eb0bdfd7d92a52fed4f08c/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L105-L105 "Source code on GitHub")

**Properties**

-   `baseLayerWidgets` **Array&lt;LayerSelectorItem&gt;** The constructed `LayerSelectorItem` widgets.

## overlayLayers

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:95-100](https://github.com/agrc-widgets/layer-selector/blob/0cd8174c371f65a562eb0bdfd7d92a52fed4f08c/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L95-L100 "Source code on GitHub")

**Properties**

-   `overlayLayers` **Array&lt;esri/layer&gt;** A list of overlay layers that have been created.
    There is no guarantee that this list will match what was passed into `overlayers` in
    the constructor. It is a list of overlayers that have been created and added to the `map`
    at one point or another.
    this.get('overlayLayers');

## overlayWidgets

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:110-110](https://github.com/agrc-widgets/layer-selector/blob/0cd8174c371f65a562eb0bdfd7d92a52fed4f08c/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L110-L110 "Source code on GitHub")

**Properties**

-   `overlayWidgets` **Array&lt;LayerSelectorItem&gt;** The constructed `LayerSelectorItem` widgets.

# layerFactory

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:1-721](https://github.com/agrc-widgets/layer-selector/blob/0cd8174c371f65a562eb0bdfd7d92a52fed4f08c/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L1-L721 "Source code on GitHub")

The info about a layer needed to create it and show it on a map and in the layer selector successfully.

**Properties**

-   `factory` **function** the constructor function for creating a layer.
-   `url` **string** The url to the map service.
-   `id` **string** The id of the layer. This is shown in the LayerSelectorItem.
-   `tileInfo` **object** The `esri/TileInfo` object if the layer has custom levels.
-   `linked` **Array&lt;string&gt;** The id of overlays to automatically enable when selected.

# startup

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:709-719](https://github.com/agrc-widgets/layer-selector/blob/0cd8174c371f65a562eb0bdfd7d92a52fed4f08c/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L709-L719 "Source code on GitHub")

We have overriden startup on `_WidgetBase` to call startup on all `LayerSelectorItem` child widgets.
You should always call startup on this widget after it has been placed in the dom.
