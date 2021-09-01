// tsup.config.ts
import type { Options } from "tsup";

export const tsup: Options = {
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  outDir: "dist",
  target: "node12",
  entryPoints: ["src/craco-ui5-plugin.ts"],
};
