[![Build Status](https://travis-ci.com/agrc-widgets/layer-selector.svg)](https://travis-ci.com/agrc-widgets/layer-selector)

![layer-selector](/layer-selector.gif)

## Usage

```
npm install @agrc/layer-selector
```

 - [ArcGISTiledMapServiceLayers](./tests/example-mapserv-basemaps.html)
 - [esri basemap](./tests/example-placement-over-esri-map.html)
 - [Happy path Web Mercator](./tests/example-happy-path-tokens.html) * _requires quad token auth_
 - [Linked Overlays](./tests/example-linked-overlays.html)
 - [Custom LODS](./tests/example-custom-lods.html)

## Development

`grunt` - _Good for hot starts when your browser is already open_

1. This will create a jasmine test page
1. Lint the code with eslint
1. Check for unused AMD dependencies
1. Create a server for the jasmine test page on `http://localhost:8001/tests/_specRunner.html`
1. Watch for changes and live reload.

`grunt launch` - _Good for cold starts_

1. Same as grunt except it will open your browser for you.

`grunt docs` - _Generate docs for project_

1. Creates the markdown docs for the project.

`grunt doc-selector` - _Good for working on `LayerSelector` docs_

1. Creates an html page
1. Sets up server at `http://localhost:8000/docs/`
1. Watches for changes and live reloads

`grunt doc-selector-item` - _Good for working on `LayerSelectorItem` docs_

1. Creates an html page
1. Sets up server at `http://localhost:8000/docs/`
1. Watches for changes and live reloads

`grunt travis` - _Good for testing CI issues_

1. Runs jasmine tests in Headless Chrome
