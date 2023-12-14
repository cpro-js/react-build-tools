import type { PluginOption, UserConfig } from "vite";

export interface UI5RegisterAppPlugin {
  appId: string;
}

export default function ui5RegisterAppPlugin(
  options: UI5RegisterAppPlugin
): PluginOption {
  const virtualModuleId = "virtual:ui5-register-app";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  const appId = options.appId;
  const appPath = appId.replace(/\./g, "/");

  return {
    name: "ui5-register-app",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `
          let startCb = function () {
            throw new Error("No App registered!");
          };
          export const register = function (cb) {
            startCb = cb;
          };

          export const render = function (options) {
            return startCb(options);
          };

          window["UI5_RUNNER@${appId}"] = {
            start: function(options) {
              return startCb(options);
            },
          };

          // it is important to set public path for webpack's module loader
          const basePath = typeof sap === 'undefined' ? "/" : sap.ui.require.toUrl("${appPath}/Component.js").replace(/Component\.js$/, "");
          window.__vitePublicAssetsURL = function(filename) {
            console.log("__vitePublicAssetsURL", filename);
            return basePath + filename;
          };

          `.trim();
      }
    },
    config() {
      const config: Partial<UserConfig> = {
        experimental: {
          renderBuiltUrl: (filename, { hostType }) => {
            if (hostType === "js") {
              return {
                runtime: `window.__vitePublicAssetsURL(${JSON.stringify(
                  filename
                )})`,
              };
            } else {
              // In HTML and CSS we only use relative paths until we craft a clever runtime CSS hack
              return { relative: true };
            }
          },
        },
      };
      return config;
    },
  };
}
