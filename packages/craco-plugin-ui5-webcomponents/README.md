# Craco UI5 Plugin

This is a [craco](https://github.com/gsoft-inc/craco) plugin that improves the bundling
of [ui5-webcomponents](https://github.com/SAP/ui5-webcomponents)
for [create-react-app](https://facebook.github.io/create-react-app/) version 4.

UI5 Webcomponents for react is made of several packages. Each package produces its own locale and language specific
message bundles. By design each bundle is loaded asynchronously with the result of loading only the needed stuff. But this
leads to several async requests in the browser which may impact your rendering time and increases the TTI (Time To
Interactive).

This plugin reconfigures webpacks default code splitting mechanism to group all of those language and locale specific files of all ui5 webcomponent packages by language. The
files are still loaded asynchronously but instead of fetching multiple files only one file will be loaded. The tradeoff
is an increase in the resulting bundle size that will be loaded asynchronously.

_Note_: This plugin is only applied for production builds.

## Installation

1. Follow
   the [`craco` Installation Instructions](https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#installation)
   to install the `craco` package with modified scripts in your `package.json`.
2. Create a `craco.config.js` file.
3. Install `@cpro-js/craco-plugin-ui5`:

```bash
yarn add --dev @cpro-js/craco-plugin-ui5-webcomponents
```

4. Initialize the craco plugin in your `craco.config.js`

**craco.config.js**

```js
module.exports = {
  plugins: [
    {
      plugin: require("@cpro-js/craco-plugin-ui5-webcomponents"),
    }
  ]
};
```

5. Build your app for production.
