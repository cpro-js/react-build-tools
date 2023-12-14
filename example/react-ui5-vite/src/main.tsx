import "./index.css";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { register } from "virtual:ui5-register-app";

import App from "./App.tsx";

register((rootNode, options) => {
  const root = ReactDOM.createRoot(rootNode);
  root.render(
    <StrictMode>
      <App config={options} />
    </StrictMode>
  );

  // => clean up
  return () => {
    root.unmount();
  };
});
