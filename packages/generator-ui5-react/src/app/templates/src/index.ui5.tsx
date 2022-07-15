import "reflect-metadata";

import { registerCustomApp } from "@cpro-js/craco-plugin-ui5/runtime";
// @ts-ignore: no typings available
import { setAnimationMode as setWebcomponentsAnimationMode } from "@ui5/webcomponents-base/dist/config/AnimationMode";
// @ts-ignore: no typings available
import { setTheme as setWebcomponentsTheme } from "@ui5/webcomponents-base/dist/config/Theme";
import React from "react";
import ReactDOM from "react-dom/client";

import { apps, getIntent } from "./appConfig";
import { App } from "./domain/App";

registerCustomApp(options => {
  const { rootNode, context, subscribeToThemeChanges, subscribeToLocaleChanges, launchpad, resolveUri } = options;

  setWebcomponentsAnimationMode(context.animationMode);
  setWebcomponentsTheme(context.theme);
  subscribeToThemeChanges(theme => {
    setWebcomponentsTheme(theme);
  });

  if (launchpad) {
    const { semanticObject } = launchpad;

    if (semanticObject && apps.length > 1) {
      // Related apps
      // Clicking on app title in shell bar shows related apps: AgreementApp, Worklist, ApprovalApp
      launchpad.setRelatedApps(
        apps.map(app => {
          const { title, icon, action, path } = app;
          return { title, icon, intent: getIntent(semanticObject, action, path) };
        })
      );
    }
  }

  const root = ReactDOM.createRoot(rootNode);
  root.render(<App resolveUri={resolveUri} locale={context.locale} />);

  // initialized via launchpad, i.e. via UI5
  // => clean up
  return () => {
    root.unmount();
  };
});

// Workaround: Force full page reload when this module is changed
// Can be removed after https://github.com/facebook/create-react-app/pull/11105 is released
if (module.hot) {
  module.hot.accept();
  const isHotUpdate = !!module.hot.data;
  if (isHotUpdate) {
    window.location.reload();
  }
}
