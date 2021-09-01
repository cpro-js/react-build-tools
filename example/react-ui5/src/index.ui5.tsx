import { registerCustomApp } from "@cpro-js/craco-plugin-ui5/runtime";
import React from "react";
import ReactDOM from "react-dom";

registerCustomApp((options) => {
  const { rootNode } = options;

  ReactDOM.render(<div>Hello UI5!</div>, rootNode);

  return () => {
    ReactDOM.unmountComponentAtNode(rootNode);
  };
});
