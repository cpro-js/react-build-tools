import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

import HtmlWebpackPlugin, { TemplateParameter } from "html-webpack-plugin";
import template from "lodash/template";
import { Compiler } from "webpack";
import { RawSource } from "webpack-sources";
import VirtualModulesPlugin from "webpack-virtual-modules";

import { buildManifest } from "../manifest";
import { buildRuntime, buildSetupWebpackEnv } from "../runtime";

const relativePath = (publicPath: string, filePath: string) => {
  return filePath.replace(publicPath, "");
};

export interface UI5ComponentPluginOptions {
  ui5ChunkName?: string;
  appTitle: string;
  appId: string;
  namespace: string;
  manifest: object; // todo
  cachebuster: boolean;
}

export class UI5ComponentPlugin {
  private readonly componentTemplatePath: string;

  constructor(private options: UI5ComponentPluginOptions) {
    this.componentTemplatePath = path.join(
      __dirname,
      "../template/Component.js"
    );
  }

  apply(compiler: Compiler) {
    this.setupRuntime(compiler);
    this.setupManifestGeneration(compiler);
    this.setupComponentGeneration(compiler);
    this.setupComponentPreloadGeneration(compiler);

    if (this.options.cachebuster) {
      this.setupCacheBusterGeneration(compiler);
    }
  }

  private setupRuntime(compiler: Compiler) {
    // override entry point of webpack config
    //
    if (
      compiler.options.entry == null ||
      typeof compiler.options.entry === "function"
    ) {
      throw new Error("Invalid webpack entry provided!");
    } else if (
      typeof compiler.options.entry === "string" ||
      Array.isArray(compiler.options.entry)
    ) {
      if (this.options.ui5ChunkName != null) {
        throw new Error(
          "option.ui5ChunkName requires a map as webpack entry. Remove ui5ChunkName!"
        );
      }

      compiler.options.entry = [
        "@cpro-js/craco-plugin-ui5-spa/setup-webpack-env.js",
        ...(Array.isArray(compiler.options.entry)
          ? compiler.options.entry
          : [compiler.options.entry]),
      ];
    } else {
      if (this.options.ui5ChunkName == null) {
        throw new Error(
          "Multiple entry points provided but option.ui5ChunkName is missing!"
        );
      }

      compiler.options.entry = {
        ...compiler.options.entry,
        [this.options.ui5ChunkName]: [
          "@cpro-js/craco-plugin-ui5-spa/setup-webpack-env.js",
          ...((Array.isArray(compiler.options.entry[this.options.ui5ChunkName])
            ? compiler.options.entry[this.options.ui5ChunkName]
            : [
                compiler.options.entry[this.options.ui5ChunkName],
              ]) as Array<string>),
        ],
      };
    }

    // disable runtime chunk to have a single script as entry point,
    compiler.options.optimization!.runtimeChunk = false;
    // Prevents conflicts when multiple webpack runtimes (from different apps) are used on the same page.
    compiler.options.output!.jsonpFunction = `webpackJsonp@${this.options.appId}`;

    // add ui5 runtime bridge, which will be called from Component.js
    const plugin = new VirtualModulesPlugin({
      "node_modules/@cpro-js/craco-plugin-ui5-spa/runtime.js": buildRuntime(
        this.options.appId
      ),
      "node_modules/@cpro-js/craco-plugin-ui5-spa/setup-webpack-env.js":
        buildSetupWebpackEnv(this.options.appId),
    });
    plugin.apply(compiler);
  }

  private setupManifestGeneration(compiler: Compiler) {
    const minimize = compiler.options.optimization?.minimize ?? false;

    // using html-webpack-plugin to build the manifest.json with all necessary js and css files
    const plugin = new HtmlWebpackPlugin({
      inject: false,
      minify: false,
      chunks:
        this.options.ui5ChunkName != null ? [this.options.ui5ChunkName] : "all",
      filename: "manifest.json",
      templateContent: (options) => {
        const { htmlWebpackPlugin } = options as TemplateParameter;

        const manifestJson = buildManifest({
          appTitle: this.options.appTitle,
          appId: this.options.appId,
          manifest: this.options.manifest,
          files: {
            js: htmlWebpackPlugin.files.js.map((filePath) =>
              relativePath(htmlWebpackPlugin.files.publicPath, filePath)
            ),
            css: htmlWebpackPlugin.files.css.map((filePath) =>
              relativePath(htmlWebpackPlugin.files.publicPath, filePath)
            ),
          },
        });

        return minimize
          ? JSON.stringify(manifestJson)
          : JSON.stringify(manifestJson, null, 2);
      },
    });
    plugin.apply(compiler);
  }

  private setupComponentGeneration(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(
      "ComponentPreloadPlugin",
      (compilation) => {
        compilation.hooks.additionalChunkAssets.tap(
          "ComponentPreloadPlugin",
          () => {
            const componentTemplate = template(
              fs.readFileSync(this.componentTemplatePath, "utf8")
            );
            const componentSource = new RawSource(
              componentTemplate({
                appId: this.options.appId,
                namespace: this.options.namespace,
              })
            );

            // @ts-ignore
            compilation.emitAsset("Component.js", componentSource);
          }
        );
      }
    );

    // add component template as dependency to rebuild on changes
    compiler.hooks.emit.tap("ComponentPreloadPlugin", (compilation) => {
      compilation.fileDependencies.add(this.componentTemplatePath);
    });
  }

  private setupComponentPreloadGeneration(compiler: Compiler) {
    compiler.hooks.emit.tapAsync(
      "ComponentPreloadPlugin",
      (compilation, callback) => {
        const modules = ["Component.js", "manifest.json"].reduce<{
          [file: string]: string;
        }>((map, file) => {
          map[`${this.options.namespace}/${file}`] =
            compilation.assets[file].source();
          return map;
        }, {});

        // todo maybe support other preload formats pre ui5 1.54?
        const template = `sap.ui.require.preload(${JSON.stringify(
          modules,
          null,
          "\t"
        )}, "${this.options.namespace}/Component-preload");`;

        // @ts-ignore
        compilation.emitAsset("Component-preload.js", new RawSource(template));
        callback();
      }
    );
  }

  private setupCacheBusterGeneration(compiler: Compiler) {
    compiler.hooks.afterEmit.tapPromise(
      "ComponentPreloadPlugin",
      async (compilation) => {
        const stats = compilation.getStats().toJson({
          assets: true,
        });

        if (stats.outputPath != null && stats.assets != null) {
          const assetsHash: Array<{ name: string; hash: string }> = [];

          for (const asset of stats.assets) {
            const hash = await this.createHashFromFile(
              path.join(stats.outputPath, asset.name)
            );
            assetsHash.push({
              name: asset.name,
              hash: hash,
            });
          }
          const cachebusterInfo = assetsHash.reduce<{
            [fileName: string]: string;
          }>((map, asset) => {
            map[asset.name] = asset.hash;
            return map;
          }, {});

          fs.writeFileSync(
            path.join(stats.outputPath, "sap-ui-cachebuster-info.json"),
            JSON.stringify(cachebusterInfo, null, 2),
            "utf8"
          );
        }
      }
    );
  }

  private createHashFromFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .on("error", reject)
        .pipe(crypto.createHash("sha1"))
        .setEncoding("hex")
        .on("error", reject)
        .on("finish", function (this: Readable) {
          resolve(this.read());
        });
    });
  }
}
