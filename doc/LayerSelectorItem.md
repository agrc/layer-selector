# LayerSelectorItem

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelectorItem.js:115-123](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelectorItem.js#L115-L123 "Source code on GitHub")

The UI element wrapping a radio or checkbox and label representing a `esri/layer/Layer` that can be turned
on and off in a map.

**Parameters**

-   `node` **[HTMLElement or string]** The domNode or string id of a domNode to create this widget on. If null
    a new div will be created but not placed in the dom. You will need to place it programmatically.
-   `params` **object** 
    -   `params.layerFactory` **layerFactory** The factory object representing a layer.
    -   `params.inputType` **[string]** `radio` or `checkbox` depending on the type of input. (optional, default `radio`)

## hidden

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelectorItem.js:59-62](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelectorItem.js#L59-L62 "Source code on GitHub")

**Parameters**

-   `hide` **boolean** `true` if the widget should add a CSS class to hide itself.

**Examples**

```javascript
this.set('hidden', true);
this.get('hidden');
```

## inputType

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelectorItem.js:91-99](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelectorItem.js#L91-L99 "Source code on GitHub")

**Parameters**

-   `inputType` **[string]**  (optional, default `radio`)

**Examples**

```javascript
this.set('inputType', 'radio');
this.get('inputType');
```

## layerFactory

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelectorItem.js:74-81](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelectorItem.js#L74-L81 "Source code on GitHub")

**Parameters**

-   `layerFactory` **layerFactory** The `layerFactory` to build the UI markup from.

**Examples**

```javascript
this.set('layerFactory', {});
this.get('layerFactory');
```

## layerType

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelectorItem.js:104-104](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelectorItem.js#L104-L104 "Source code on GitHub")

**Properties**

-   `layerType` **string** The type of `LayerSelectorItem`. `baselayer` (radio) or `overlayer` (checkbox).

## selected

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelectorItem.js:45-49](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelectorItem.js#L45-L49 "Source code on GitHub")

**Parameters**

-   `checked` **boolean** `true` if the widgets input should be checked.

**Examples**

```javascript
this.set('selected', true);
this.get('selected');
```

# layerFactory

[c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelectorItem.js:1-142](https://github.com/agrc-widgets/layer-selector/blob/380a3162f4de473230737475b1192213eed17f59/c:\Projects\GitHub\agrc-widgets\layer-selector\LayerSelectorItem.js#L1-L142 "Source code on GitHub")

The info about a layer needed to create it and show it on a map and in the layer selector successfully.

**Properties**

-   `factory` **function** the constructor function for creating a layer.
-   `url` **string** The url to the map service.
-   `id` **string** The id of the layer. This is shown in the LayerSelectorItem.
-   `tileInfo` **object** The `esri/TileInfo` object if the layer has custom levels.
-   `linked` **Array&lt;string&gt;** The id of overlays to automatically enable when selected.
