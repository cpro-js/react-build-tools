// enhances create react app default config
import path from "path";

import { CracoUi5PluginOptions } from "@cpro-js/craco-plugin-ui5/src/craco-ui5-plugin";
import { whenProd } from "@craco/craco";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

export function createCracoConfig(ui5Config: CracoUi5PluginOptions) {
  return () => {
    return {
      babel: {
        plugins: ["babel-plugin-transform-typescript-metadata"],
      },
      webpack: {
        plugins: [
          ...whenProd(
            () => [
              new BundleAnalyzerPlugin({
                analyzerMode: "static",
                reportFilename: path.join(
                  __dirname,
                  "report",
                  "webpack-report.html"
                ),
              }),
            ],
            []
          ),
        ],
      },
      plugins: [
        {
          plugin: require("@cpro-js/craco-plugin-ui5-webcomponents"),
        },
        {
          plugin: require("@cpro-js/craco-plugin-ui5"),
          options: ui5Config,
        },
      ],
    };
  };
}
