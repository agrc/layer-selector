# LayerSelector

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:157-168](https://github.com/agrc-widgets/layer-selector/blob/8328f4889f78a60a92ff663a1d02df09d13f95a6/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L157-L168 "Source code on GitHub")

A class for creating a layer selector that changes layers for a given map.

**Parameters**

-   `node` **[HTMLElement or string]** The domNode or string id of a domNode to create this widget on. If null
    a new div will be created but not placed in the dom. You will need to place it programmatically.
-   `params`  {object}
    -   `params.map` **esri/map or agrc/widgets/map/BaseMap** The map to control layer selection within.
    -   `params.baseLayers` **Array&lt;layerFactory&gt; or Array&lt;applianceTokens&gt;** mutually exclusive layers (only one can be visible on your map).
    -   `params.overlays` **[Array&lt;layerFactory&gt; or Array&lt;applianceTokens&gt;]** layers you display over the `baseLayers`.
    -   `params.quadWord` **[string]** The four word authentication token acquired from the appliance.
    -   `params.separator` **[string]** An HTML fragment used to
        separate baselayers from overlays. (optional, default `<hr class`)
    -   `params.top` **[boolean]** True if the widget should be placed in the top of the container. (optional, default `true`)
    -   `params.right` **[boolean]** True if the widget should be placed in the right of the container. (optional, default `true`)

## baseLayerWidgets

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:95-95](https://github.com/agrc-widgets/layer-selector/blob/8328f4889f78a60a92ff663a1d02df09d13f95a6/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L95-L95 "Source code on GitHub")

**Properties**

-   `baseLayerWidgets` **Array&lt;LayerSelectorItem&gt;** The constructed `LayerSelectorItem` widgets.

## overlayWidgets

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:100-100](https://github.com/agrc-widgets/layer-selector/blob/8328f4889f78a60a92ff663a1d02df09d13f95a6/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L100-L100 "Source code on GitHub")

**Properties**

-   `overlayWidgets` **Array&lt;LayerSelectorItem&gt;** The constructed `LayerSelectorItem` widgets.

## visibleLayers

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:55-90](https://github.com/agrc-widgets/layer-selector/blob/8328f4889f78a60a92ff663a1d02df09d13f95a6/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L55-L90 "Source code on GitHub")

**Properties**

-   `visibleLayers` **visibleLayers** An object containting array's of visible `LayerSelectorItems` widgets
    and `esri/layer` layers that are currently visible in the map.

**Examples**

```javascript
this.get('visibleLayers');
```

# applianceTokens

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:1-710](https://github.com/agrc-widgets/layer-selector/blob/8328f4889f78a60a92ff663a1d02df09d13f95a6/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L1-L710 "Source code on GitHub")

The happy path tokens for fast tracked basemap layers.

**Properties**

-   `Terrain` **string** Elevation with mountain peak elevations, contour lines, as well as many of the places of interest .
-   `Lite` **string** Minimal base map with very muted in color to make your overlayed data stand out beautifully.
-   `Topo` **string** USGS Quad Sheet.
-   `Imagery` **string** Aerial Imagery.
-   `ColorIR` **string** NAIP 2011 color infrared.
-   `Overlay` **string** Roads and place names as a stand alone cache used to create our Hybrid cache.
-   `Hybrid` **string** Automatic link of Imagery and Overlay. You must have `Overlay` present in `overlays` property

**Examples**

```javascript
{
     baseLayers: [
        'Imagery',
        'Hybrid',
        {
            token: 'Lite',
            selected: true
        },
        'Topo',
        'Terrain',
        'Color IR'
        ],
     overlays: ['Overlay']
}
```

# layerFactory

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:1-710](https://github.com/agrc-widgets/layer-selector/blob/8328f4889f78a60a92ff663a1d02df09d13f95a6/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L1-L710 "Source code on GitHub")

The info about a layer needed to create it and show it on a map and in the layer selector successfully.

**Properties**

-   `Factory` **function** the constructor function for creating a layer.
-   `url` **string** The url to the map service.
-   `id` **string** The id of the layer. This is shown in the LayerSelectorItem.
-   `tileInfo` **object** The `esri/TileInfo` object if the layer has custom levels.
-   `linked` **Array&lt;string&gt;** The id of overlays to automatically enable when selected.

# startup

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:698-708](https://github.com/agrc-widgets/layer-selector/blob/8328f4889f78a60a92ff663a1d02df09d13f95a6/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L698-L708 "Source code on GitHub")

We have overriden startup on `_WidgetBase` to call startup on all `LayerSelectorItem` child widgets.
You should always call startup on this widget after it has been placed in the dom.

# visibleLayers

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js:1-710](https://github.com/agrc-widgets/layer-selector/blob/8328f4889f78a60a92ff663a1d02df09d13f95a6/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelector.js#L1-L710 "Source code on GitHub")

The return value of the `visibleLayers` property.

**Properties**

-   `widgets` **Array&lt;LayerSelectorItem&gt;** The visible `LayerSelectorItems`.
-   `layers` **Array&lt;esri/layer&gt;** The visible `esri/layer/*`.
