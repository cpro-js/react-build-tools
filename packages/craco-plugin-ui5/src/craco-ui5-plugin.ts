import HtmlWebpackPlugin from "html-webpack-plugin";
import type { Configuration } from "webpack";

import type { LaunchpadTile } from "./types";
import { createFioriSandboxConfigJson } from "./ui5/launchpad/sandbox";
import { UI5ComponentPlugin } from "./ui5/plugin/UI5ComponentPlugin";

const path = require("path");
const { pluginByName, removePlugins, addPlugins } = require("@craco/craco");
const getClientEnvironment = require("react-scripts/config/env");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");

export interface CracoUi5PluginOptions {
  appTitle: string;
  appId: string;
  ui5Version: string;
  sandbox: {
    theme: string;
    tiles: Array<LaunchpadTile>;
  };
  manifest: object; // todo
}

interface OverrideWebpackConfigOptions {
  webpackConfig: Configuration;
  pluginOptions: CracoUi5PluginOptions;
  context: {
    env: "development" | "production";
    paths: any;
  };
}

export const overrideWebpackConfig = ({
  webpackConfig,
  pluginOptions,
  context: { env: webpackEnv, paths },
}: OverrideWebpackConfigOptions) => {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";
  const generateCacheBuster = isEnvProduction;

  const appId = pluginOptions.appId;
  const appNamespace = appId.replace(/\./g, "/");

  if (Array.isArray(webpackConfig.entry)) {
    // no fast refresh -> webpack hot module loading
    throw new Error("Sorry, not implemented. Please enable Fast Refresh!");
  } else {
    // production build or fast refresh
    delete webpackConfig.entry;

    webpackConfig.entry = {
      main: paths.appIndexJs,
      ui5: path.join(paths.appSrc, "index.ui5.tsx"),
    };

    // output files in static folder & hash files for production
    webpackConfig.output!.filename = isEnvProduction
      ? "static/js/[name].[contenthash:8].js"
      : "static/js/[name].js";
  }

  // use relative file paths (only used for index.html, runtime overrides this for ui5)
  webpackConfig.output!.publicPath = "";

  // remove asset manifest -> not needed
  removePlugins(webpackConfig, pluginByName("ManifestPlugin"));

  // prepare custom HTML templates
  removePlugins(webpackConfig, pluginByName("HtmlWebpackPlugin"));
  removePlugins(webpackConfig, pluginByName("InterpolateHtmlPlugin"));

  // default: app loaded the react way
  addPlugins(webpackConfig, [
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ["main"],
      template: path.join(paths.appPublic, "index.html"),
      filename: "index.html",
    }),
  ]);

  // ui5: app loaded via UI5 Component.js
  addPlugins(webpackConfig, [
    // ui5-standalone: standalone.html - loads Scripts via Component.js via UI5 bootstrapping
    new HtmlWebpackPlugin({
      inject: false,
      title: "Standalone",
      template: path.join(__dirname, "../template/standalone.html"),
      filename: "standalone.html",
      templateParameters: {
        ui5Version: pluginOptions.ui5Version,
        sandbox: {
          appId: appId,
          appName: "ReactApp-display",
          theme: pluginOptions.sandbox.theme,
        },
        scriptAttributes: generateCacheBuster
          ? `data-sap-ui-appCachebuster="./"`
          : "",
      },
    }),
    new UI5ComponentPlugin({
      appTitle: pluginOptions.appTitle,
      appId: appId,
      namespace: appNamespace,
      manifest: pluginOptions.manifest,
      ui5ChunkName: "ui5",
      cachebuster: generateCacheBuster,
    }),
  ]);

  // ui5: app loaded via launchpad
  addPlugins(webpackConfig, [
    // ui5-launchpad: launchpad html - loads Scripts via Component.js via UI5 bootstrapping
    new HtmlWebpackPlugin({
      inject: false,
      title: "Launchpad",
      template: path.join(__dirname, "../template/launchpad.html"),
      filename: "launchpad.html",
      templateParameters: {
        ui5Version: pluginOptions.ui5Version,
        sandbox: {
          theme: pluginOptions.sandbox.theme,
        },
      },
    }),
    new HtmlWebpackPlugin({
      inject: false,
      minify: false,
      filename: "appconfig/fioriSandboxConfig.json",
      templateContent: ({ htmlWebpackPlugin }) => {
        const sandboxConfig = createFioriSandboxConfigJson(
          appId,
          pluginOptions.sandbox.tiles
        );
        return JSON.stringify(sandboxConfig, null, 2);
      },
    }),
  ]);

  // replace env variables in html templates
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
  addPlugins(webpackConfig, [
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
  ]);

  // Always return the config object.
  return webpackConfig;
};
