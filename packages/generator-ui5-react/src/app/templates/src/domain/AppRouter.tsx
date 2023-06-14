import { createUI5History } from "@cpro-js/history-ui5";
import React, { FC, useMemo } from "react";
import { Route, Router, Switch } from "react-router-dom";

import { I18nTestScreen } from "./demo/I18nTestScreen";
import { TestScreen } from "./demo/TestScreen";

export interface AppRouterProps {}

export const AppRouter: FC<AppRouterProps> = () => {
  const ui5History = useMemo(() => createUI5History({}), []);

  return (
    <Router history={ui5History}>
      <Switch>
        <Route path="/i18n" component={I18nTestScreen} />
        <Route path="/" component={TestScreen} />
      </Switch>
    </Router>
  );
};
