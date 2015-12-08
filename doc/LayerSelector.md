# LayerSelector

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:187-198](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L187-L198 "Source code on GitHub")

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

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:57-62](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L57-L62 "Source code on GitHub")

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

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:128-128](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L128-L128 "Source code on GitHub")

**Properties**

-   `baseLayerWidgets` **Array&lt;LayerSelectorItem&gt;** The constructed `LayerSelectorItem` widgets.

## overlayLayers

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:118-123](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L118-L123 "Source code on GitHub")

**Properties**

-   `overlayLayers` **Array&lt;esri/layer&gt;** A list of overlay layers that have been created.
    There is no guarantee that this list will match what was passed into `overlayers` in
    the constructor. It is a list of overlayers that have been created and added to the `map`
    at one point or another.
    this.get('overlayLayers');

## overlayWidgets

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:133-133](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L133-L133 "Source code on GitHub")

**Properties**

-   `overlayWidgets` **Array&lt;LayerSelectorItem&gt;** The constructed `LayerSelectorItem` widgets.

## visibleLayers

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:72-107](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L72-L107 "Source code on GitHub")

**Properties**

-   `visibleLayers` **visibleLayers** An object containting array's of visible `LayerSelectorItems` widgets
    and `esri/layer` layers that are currently visible in the map.

**Examples**

```javascript
this.get('baseLayerLayers');
```

# layerFactory

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:1-744](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L1-L744 "Source code on GitHub")

The info about a layer needed to create it and show it on a map and in the layer selector successfully.

**Properties**

-   `factory` **function** the constructor function for creating a layer.
-   `url` **string** The url to the map service.
-   `id` **string** The id of the layer. This is shown in the LayerSelectorItem.
-   `tileInfo` **object** The `esri/TileInfo` object if the layer has custom levels.
-   `linked` **Array&lt;string&gt;** The id of overlays to automatically enable when selected.

# startup

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:732-742](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L732-L742 "Source code on GitHub")

We have overriden startup on `_WidgetBase` to call startup on all `LayerSelectorItem` child widgets.
You should always call startup on this widget after it has been placed in the dom.

# visibleLayers

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:1-744](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L1-L744 "Source code on GitHub")

The return value of the `visibleLayers` property.

**Properties**

-   `widgets` **Array&lt;LayerSelectorItem&gt;** The visible `LayerSelectorItems`.
-   `layers` **Array&lt;esri/layer&gt;** The visible `esri/layer/*`.
