import type { Configuration } from "webpack";

import { UI5WebcomponentSplittingLanguagePlugin } from "./optimize/UI5WebcomponentSplittingLanguagePlugin";

const { addPlugins } = require("@craco/craco");

interface OverrideWebpackConfigOptions {
  webpackConfig: Configuration;
  context: {
    env: "development" | "production";
    paths: any;
  };
}

export const overrideWebpackConfig = ({
  webpackConfig,
  context: { env: webpackEnv, paths },
}: OverrideWebpackConfigOptions) => {
  const isEnvProduction = webpackEnv === "production";

  // optimize ui5 bundle sizes - merge locale files per language, reduces requests
  if (isEnvProduction) {
    addPlugins(webpackConfig, [
      new UI5WebcomponentSplittingLanguagePlugin({
        cwd: paths.appPath,
      }),
    ]);
  }

  // Always return the config object.
  return webpackConfig;
};
