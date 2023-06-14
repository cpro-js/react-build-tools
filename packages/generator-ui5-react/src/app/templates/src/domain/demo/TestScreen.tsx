import { observer } from "@cpro-js/react-core";
import { Button, ButtonDesign, Title } from "@ui5/webcomponents-react";
import { FC, useCallback } from "react";
import { useHistory } from "react-router";

import { MainLayout } from "../layout/MainLayout";
import { useTestScreenStyles } from "./TestScreen.style";

export const TestScreen: FC = observer(() => {
  // hook for routing => react-router
  const history = useHistory();
  // CSS integration example
  const style = useTestScreenStyles();

  // event handler
  const goToI18n = useCallback(() => {
    // navigation to different page => see AppRouter
    history.push("i18n");
  }, []);

  return (
    <MainLayout
      pageTitle={"My Test Page"}
      headerContent={<p>My Header Content</p>}
      footerEndContent={
        <>
          <Button design={ButtonDesign.Transparent} onClick={goToI18n}>
            Go to I18n Test Screen!
          </Button>
        </>
      }
    >
      <Title>My very first Test Page!</Title>
    </MainLayout>
  );
});
