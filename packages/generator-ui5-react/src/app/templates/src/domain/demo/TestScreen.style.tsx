import { createUseStyles } from "react-jss";

import { CssStyles } from "../../style/CssStyles";

const styles: CssStyles = {
  myTitle: {
    color: "green",
  },
};

export const useTestScreenStyles = createUseStyles(styles);
