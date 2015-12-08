# LayerSelector

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:154-165](https://github.com/agrc-widgets/layer-selector/blob/ac8339c9071fb9f89adb73d05ea095af6cf3dad5/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L154-L165 "Source code on GitHub")

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

## baseLayerWidgets

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:95-95](https://github.com/agrc-widgets/layer-selector/blob/ac8339c9071fb9f89adb73d05ea095af6cf3dad5/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L95-L95 "Source code on GitHub")

**Properties**

-   `baseLayerWidgets` **Array&lt;LayerSelectorItem&gt;** The constructed `LayerSelectorItem` widgets.

## overlayWidgets

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:100-100](https://github.com/agrc-widgets/layer-selector/blob/ac8339c9071fb9f89adb73d05ea095af6cf3dad5/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L100-L100 "Source code on GitHub")

**Properties**

-   `overlayWidgets` **Array&lt;LayerSelectorItem&gt;** The constructed `LayerSelectorItem` widgets.

## visibleLayers

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:55-90](https://github.com/agrc-widgets/layer-selector/blob/ac8339c9071fb9f89adb73d05ea095af6cf3dad5/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L55-L90 "Source code on GitHub")

**Properties**

-   `visibleLayers` **visibleLayers** An object containting array's of visible `LayerSelectorItems` widgets
    and `esri/layer` layers that are currently visible in the map.

**Examples**

```javascript
this.get('baseLayerLayers');
```

# layerFactory

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:1-711](https://github.com/agrc-widgets/layer-selector/blob/ac8339c9071fb9f89adb73d05ea095af6cf3dad5/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L1-L711 "Source code on GitHub")

The info about a layer needed to create it and show it on a map and in the layer selector successfully.

**Properties**

-   `factory` **function** the constructor function for creating a layer.
-   `url` **string** The url to the map service.
-   `id` **string** The id of the layer. This is shown in the LayerSelectorItem.
-   `tileInfo` **object** The `esri/TileInfo` object if the layer has custom levels.
-   `linked` **Array&lt;string&gt;** The id of overlays to automatically enable when selected.

# startup

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:699-709](https://github.com/agrc-widgets/layer-selector/blob/ac8339c9071fb9f89adb73d05ea095af6cf3dad5/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L699-L709 "Source code on GitHub")

We have overriden startup on `_WidgetBase` to call startup on all `LayerSelectorItem` child widgets.
You should always call startup on this widget after it has been placed in the dom.

# visibleLayers

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:1-711](https://github.com/agrc-widgets/layer-selector/blob/ac8339c9071fb9f89adb73d05ea095af6cf3dad5/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L1-L711 "Source code on GitHub")

The return value of the `visibleLayers` property.

**Properties**

-   `widgets` **Array&lt;LayerSelectorItem&gt;** The visible `LayerSelectorItems`.
-   `layers` **Array&lt;esri/layer&gt;** The visible `esri/layer/*`.
