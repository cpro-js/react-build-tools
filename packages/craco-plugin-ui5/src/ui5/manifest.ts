import deepmerge from "deepmerge";

export const buildManifest = ({
  appTitle,
  appId,
  manifest: userManifest = {},
  files,
}: {
  appTitle: string;
  appId: string;
  manifest: {};
  files: { js: Array<string>; css: Array<string> };
}) => {
  const manifest = deepmerge.all([
    {
      "sap.app": {
        applicationVersion: {
          version: "1.0.0",
        },
        title: appTitle,
      },
      "sap.ui": {
        deviceTypes: {
          desktop: true,
          tablet: true,
          phone: true,
        },
      },
      "sap.ui5": {
        dependencies: {
          minUI5Version: "1.76.0",
        },
        contentDensities: {
          compact: true,
          cozy: true,
        },
        resources: {
          models: {
            i18n: {
              type: "sap.ui.model.Model",
            },
          },
        },
      },
    },
    userManifest,
    {
      _version: "1.28.0",
      "sap.app": {
        id: appId,
        type: "application",
        i18n: {
          bundleUrl: "i18n/i18n.properties",
          supportedLocales: [""],
          fallbackLocale: "",
        },
        offline: false,
      },
      "sap.ui": {
        technology: "UI5",
      },
      "sap.ui5": {
        dependencies: {
          libs: {
            "sap.ui.core": {},
          },
        },
        resources: {
          js: files.js.map((file) => ({
            uri: file,
          })),
          css: files.css.map((file) => ({
            uri: file,
          })),
        },
        services: {
          ShellUIService: {
            factoryName: "sap.ushell.ui5service.ShellUIService",
          },
        },
      },
    },
  ]);

  return manifest;
};
