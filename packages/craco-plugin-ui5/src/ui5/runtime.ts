export const buildRuntime = function (appId: string) {
  return `
var startCb = function () {
  throw new Error("No App registered!");
};
exports.registerCustomApp = function (cb) {
  startCb = cb;
};

global["UI5_RUNNER@${appId}"] = {
  start: function(options) {
    return startCb(options);
  },
};
  `.trim();
};

export const buildSetupWebpackEnv = function (appId: string) {
  return `
  (function() {
    // it is important to set public path for webpack's module loader
    var basePath = sap.ui.require.toUrl("${appId.replace(
      /\./g,
      "/"
    )}/Component.js").replace(/Component\.js$/, "");
    __webpack_public_path__ = basePath;
  })();
  `.trim();
};
