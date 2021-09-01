import * as PluginExports from "../src/craco-ui5-plugin";

test("correct exports", () => {
  expect(PluginExports.overrideWebpackConfig).toBeInstanceOf(Function);
});
