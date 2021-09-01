# Craco UI5 Plugin

This is a [craco](https://github.com/gsoft-inc/craco) plugin that builds a react app for UI5
via [create-react-app](https://facebook.github.io/create-react-app/) version 4.

## Installation

1. Follow
   the [`craco` Installation Instructions](https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#installation)
   to install the `craco` package with modified scripts in your `package.json`.
2. Create a `craco.config.js` file.
3. Install `@cpro-js/craco-plugin-ui5`:

```bash
yarn add --dev @cpro-js/craco-plugin-ui5
```

4. Initialize the craco plugin in your `craco.config.js`

**craco.config.js**

```js
module.exports = {
  plugins: [
    {
      plugin: require("@cpro-js/craco-plugin-ui5"),
      options: {
        appId: "Z_YOUR_APP_ID",
        appTitle: "Your App Title",
        ui5Version: "1.84.14",
        sandbox: {
          theme: "sap_fiori_3",
          tiles: [
            {
              // combination of semanticObject and action must be unique per item!
              semanticObject: "ReactApp",
              action: "display",
              title: "React App 1",
              subtitle: "React App Example",
              info: "React App Example",
              icon: "sap-icon://decision",
              // parameters that will be always set (default) and provided as startup parameters
              defaultParameters: {
                myValue: "test",
              },
              // parameters by cross navigation
              additionalParameters: true,
            },
            {
              semanticObject: "ReactApp",
              action: "manage",
              title: "React App 2",
              subtitle: "React App Example",
              info: "React App Example",
              icon: "sap-icon://complete",
            },
          ],
        },
        manifest: {
          "sap.ui": {
            fullWidth: true,
          },
          "sap.ui5": {
            dependencies: {
              minUI5Version: "1.76.0",
            },
            contentDensities: {
              compact: true,
              cozy: true,
            },
          },
        },
      },
    },]
};
```

5. Create a secondary entry point for UI5 initialization:

**src/index.ui5.tsx**

```tsx
import { registerCustomApp } from "@cpro-js/craco-plugin-ui5/runtime";
import React from "react";
import ReactDOM from "react-dom";

registerCustomApp(options => {
  const { rootNode, } = options;

  ReactDOM.render(
    <div>Hello UI5!</div>,
    rootNode
  );

  return () => {
    ReactDOM.unmountComponentAtNode(rootNode);
  };
});
```

6. Launch app & open browser
   - Default react entry: http://localhost:3000/
   - UI5 in Standalone: http://localhost:3000/standalone.html
   - UI5 in Fiori Launchpad Sandbox: http://localhost:3000/launchpad.html
