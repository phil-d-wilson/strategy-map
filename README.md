# balena Strategy Map

This app is a proof of concept (and may form the MVP) aiming to surface the strategy behind the work being performed by the balena team. The app aims to help visualise the top-down strategy towards balena's goals, but also provide a way to balance that with the bottom-up of demand from our feedback loops.

## Architecture

This app was inspired and has borrowed heavily from the brilliant: http://www.wineandcheesemap.com/

The technologies used for this project include:

- Building
  - Webpack: Bundle JS
  - PostCSS: Bundle CSS
  - Babel: Compile newer JS to older JS to support older browsers
  - CSSNext: Compile newer CSS to older CSS to support older browsers
- UI
  - Preact: Basic component support
  - Cytoscape: Graph/network visualisation
- Linting
  - ESLint: Identify common problems in JS
  - Stylelint: Identify common problems in CSS

## Building

The build targets are specified as npm scripts.  Use `npm run <target>` for one of the following targets:

- `watch` : Do a debug build of the app, which automatically rebuilds and reloads as the code changes
- `prod` : Do a production build of the app
- `clean` : Delete all files under the dist directory
- `lint` : Run linters on the JS and CSS files

