# LayerSelector

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:109-120](https://github.com/steveoh/layer-selector/blob/39d9ac9cea6a60a42a921259ddf97afbb10424a9/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L109-L120 "Source code on GitHub")

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

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:50-50](https://github.com/steveoh/layer-selector/blob/39d9ac9cea6a60a42a921259ddf97afbb10424a9/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L50-L50 "Source code on GitHub")

**Properties**

-   `baseLayerWidgets` **Array&lt;LayerSelectorItem&gt;** The constructed `LayerSelectorItem` widgets.

## overlayWidgets

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:55-55](https://github.com/steveoh/layer-selector/blob/39d9ac9cea6a60a42a921259ddf97afbb10424a9/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L55-L55 "Source code on GitHub")

**Properties**

-   `overlayWidgets` **Array&lt;LayerSelectorItem&gt;** The constructed `LayerSelectorItem` widgets.

# layerFactory

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:1-666](https://github.com/steveoh/layer-selector/blob/39d9ac9cea6a60a42a921259ddf97afbb10424a9/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L1-L666 "Source code on GitHub")

The info about a layer needed to create it and show it on a map and in the layer selector successfully.

**Properties**

-   `factory` **function** the constructor function for creating a layer.
-   `url` **string** The url to the map service.
-   `id` **string** The id of the layer. This is shown in the LayerSelectorItem.
-   `tileInfo` **object** The `esri/TileInfo` object if the layer has custom levels.
-   `linked` **Array&lt;string&gt;** The id of overlays to automatically enable when selected.

# startup

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:654-664](https://github.com/steveoh/layer-selector/blob/39d9ac9cea6a60a42a921259ddf97afbb10424a9/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L654-L664 "Source code on GitHub")

We have overriden startup on `_WidgetBase` to call startup on all `LayerSelectorItem` child widgets.
You should always call startup on this widget after it has been placed in the dom.
