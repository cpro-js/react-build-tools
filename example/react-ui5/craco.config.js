module.exports = {
  plugins: [
    {
      plugin: require("@cpro-js/craco-plugin-ui5-webcomponents"),
    },
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
    },
  ],
};
