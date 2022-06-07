const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

const config = [
  {
    entry: {
      app: [__dirname + "/src/app/index.ts"],
    },
    output: {
      path: __dirname + "/generators/",
      filename: "[name]/index.js",
      libraryTarget: "commonjs-module",
    },
    // externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: [
      nodeExternals({ additionalModuleDirs: ["../../node_modules"] }),
    ], // in order to ignore all modules in node_modules folder
    devtool: "source-map",
    mode: "production",
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      alias: {},
    },
    target: "node",
    node: {
      __dirname: false,
      __filename: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: [/lib/, /dist/, /templates/, /temp-templates/],
          use: [
            {
              loader: "ts-loader",
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "src/app/templates",
            to: "app/templates",
            info: { minimized: true },
          },
        ],
      }),
    ],
  },
];

module.exports = config;
