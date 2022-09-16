import { CracoUi5PluginOptions } from "@cpro-js/craco-plugin-ui5";

const config: CracoUi5PluginOptions = {
  appId: "Z_YOUR_APP_ID",
  appTitle: "<%= appTitle %>",
  ui5Version: "1.84.28",
  sandbox: {
    theme: "sap_fiori_3",
    tiles: [
      {
        // combination of semanticObject and action must be unique per item!
        semanticObject: "<%= semanticObject %>",
        action: "<%= actionName %>",
        title: "<%= appTitle %>",
        subtitle: "<%= appSubTitle %>",
        info: "<%= appInfo %>",
        icon: "sap-icon://<%= appIcon %>",
        // parameters that will be always set (default) and provided as startup parameters
        /*defaultParameters: {
          myValue: "test",
        },*/
        // parameters by cross navigation
        //additionalParameters: true,
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
};

export default config;
