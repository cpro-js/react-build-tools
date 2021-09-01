import fs from "fs";
import path from "path";

import resolveFrom from "resolve-from";
import webpack, { Compiler } from "webpack";

export interface UI5WebcomponentLanguageMergingPluginOptions {
  cwd: string;
}

/**
 * Optimizes async loading of message bundles for all @ui5 modules
 * Normally each message bundle for each @ui5 module will be splitted into it's own chunk (default webpack behaviour for async imports).
 *
 * This plugin groups all async imports of @ui5 by language, which reduces the files to load on the first request.
 * Instead of up to 5 small language files only a single file will be fetched.
 */
export class UI5WebcomponentSplittingLanguagePlugin {
  private readonly pathsToSearch: Array<string>;
  private readonly ui5Languages: Array<string>;

  constructor(private options: UI5WebcomponentLanguageMergingPluginOptions) {
    const modules = [
      "@ui5/webcomponents-localization",
      "@ui5/webcomponents",
      "@ui5/webcomponents-icons",
      "@ui5/webcomponents-fiori",
      "@ui5/webcomponents-react",
    ];
    const resolvedModulePaths = modules
      .map((mod) => resolveFrom.silent(this.options.cwd, mod + "/package.json"))
      .filter((p): p is string => p != null)
      .map((p) => path.dirname(p));

    this.pathsToSearch = ([] as Array<string>)
      .concat(
        ...resolvedModulePaths.map((p) => [
          path.join(p, "dist/generated/assets/cldr"),
          path.join(p, "dist/generated/assets/i18n"),
          path.join(p, "dist/assets/i18n"),
        ])
      )
      .filter((p) => fs.existsSync(p) && fs.statSync(p).isDirectory())
      .filter((p) => fs.readdirSync(p).some((file) => file.endsWith(".json")));

    this.ui5Languages =
      UI5WebcomponentSplittingLanguagePlugin.getLanguagesFromFileNames(
        ([] as Array<string>).concat(
          ...this.pathsToSearch.map((localizationPath) =>
            fs
              .readdirSync(localizationPath)
              .filter((file) => file.endsWith(".json"))
          )
        )
      );
  }

  apply(compiler: Compiler) {
    const rawSplitChunks = compiler.options.optimization!.splitChunks;
    const splitChunks: webpack.Options.SplitChunksOptions =
      rawSplitChunks != null && typeof rawSplitChunks !== "boolean"
        ? rawSplitChunks
        : {};
    const cacheGroups =
      typeof splitChunks.cacheGroups === "object"
        ? splitChunks.cacheGroups
        : {};

    compiler.options.optimization!.splitChunks = {
      ...splitChunks,
      cacheGroups: {
        ...cacheGroups,
        default: false, // disable the built-in groups, default & vendors (vendors is overwritten below)
        vendors: {
          // picks up everything else being used from node_modules as vendors chunk, even async modules
          chunks: "all",
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 1,
          enforce: true, // create chunk regardless of the size of the chunk
        },
        ...this.ui5Languages.reduce<{
          [key: string]: webpack.Options.CacheGroupsOptions;
        }>((groups, language) => {
          // create custom chunk group per language for async chunks of @ui5
          groups["ui5-lang-" + language] = {
            chunks: "async",
            name: "ui5-lang-" + language,
            priority: 2,
            enforce: true, // create chunk regardless of the size of the chunk, otherwise the chunk will move up to vendors if it's too small
            test: (module) => {
              return (
                module.resource &&
                this.isUI5LanguageDependency(module.resource, language)
              );
            },
          };

          return groups;
        }, {}),
      },
    };
  }

  private isUI5LanguageDependency(filePath: string, language: string): boolean {
    return (
      filePath.endsWith(".json") &&
      path
        .basename(filePath)
        .replace("messagebundle_", "")
        .startsWith(language) &&
      this.pathsToSearch.some((basePath) =>
        path.normalize(filePath).includes(path.normalize(basePath))
      )
    );
  }

  private static getLanguagesFromFileNames(
    files: Array<string>
  ): Array<string> {
    return Array.from(
      new Set(
        files.map((file) => {
          const parts = file
            .replace("messagebundle_", "")
            .replace(".json", "")
            .split("_");
          return parts[0];
        })
      )
    );
  }
}
