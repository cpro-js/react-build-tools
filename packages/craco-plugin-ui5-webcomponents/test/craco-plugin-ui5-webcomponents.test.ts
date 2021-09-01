import * as PluginExports from "../src/craco-plugin-ui5-webcomponents";

test("correct exports", () => {
  expect(PluginExports.overrideWebpackConfig).toBeInstanceOf(Function);
});
