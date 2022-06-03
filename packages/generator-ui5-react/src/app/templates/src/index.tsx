import "reflect-metadata";

import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./domain/App";

const resolveUri = (path: string) => path;

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App resolveUri={resolveUri} locale={"en"} />);

// Workaround: Force full page reload when this module is changed
// Can be removed after https://github.com/facebook/create-react-app/pull/11105 is released
if (module.hot) {
  module.hot.accept();
  const isHotUpdate = !!module.hot.data;
  if (isHotUpdate) {
    window.location.reload();
  }
}
