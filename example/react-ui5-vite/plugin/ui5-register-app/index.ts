import type { PluginOption } from "vite";

export default function ui5RegisterAppPlugin(): PluginOption {
  const virtualModuleId = "virtual:ui5-register-app";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  // TODO determine!
  const appId = "react.ui5.vite";

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
          };`.trim();
      }
    },
  };
}
