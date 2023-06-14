import { observer } from "@cpro-js/react-core";
import { Bar, BarDesign, DynamicPage, DynamicPageHeader, DynamicPageTitle } from "@ui5/webcomponents-react";
import { FC, ReactNode } from "react";

export interface MainLayoutProps {
  /**
   * Title of the page.
   * Note: Used within Variant Management component.
   */
  pageTitle: string;

  pageSubTitle?: ReactNode;

  /**
   * The search form which will be rendered in the header.
   */
  headerContent?: ReactNode;

  showHeaderAlways?: boolean;
  /**
   * Show the pin to fix the header between header and content body.
   */
  showHeaderPinButton?: boolean;
  /**
   * Show hide button between header and content body.
   */
  showHeaderHideButton?: boolean;

  /**
   *
   */
  footerStartContent?: ReactNode;
  /**
   * Pass a fragment with a list of Buttons, which will be rendered within the floating footer.
   * Example:
   * <code>
   * <>
   *  <Button design={ButtonDesign.Transparent} onClick={...}>Test</Button>
   * </>
   * </code>
   */
  footerEndContent?: ReactNode;

  /**
   * The body of the page, i.e. search results. Render whatever you want.
   */
  children: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = observer(props => {
  const {
    pageTitle,
    pageSubTitle,
    headerContent,
    showHeaderAlways,
    showHeaderHideButton,
    showHeaderPinButton,
    footerStartContent,
    footerEndContent,
    children,
  } = props;

  return (
    <DynamicPage
      headerTitle={<DynamicPageTitle header={pageTitle} subHeader={pageSubTitle} />}
      headerContent={headerContent ? <DynamicPageHeader>{headerContent}</DynamicPageHeader> : undefined}
      alwaysShowContentHeader={!!showHeaderAlways}
      footer={<Bar design={BarDesign.FloatingFooter} startContent={footerStartContent} endContent={footerEndContent} />}
      headerContentPinnable={!!showHeaderPinButton}
      showHideHeaderButton={!!showHeaderHideButton}
    >
      {children}
    </DynamicPage>
  );
});
