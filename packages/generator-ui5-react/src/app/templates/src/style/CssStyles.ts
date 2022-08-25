import { CSSProperties } from "react";

export interface CssStyles extends Record<string, CSSProperties | CssStyles> {}

export enum BADGE_COLOR {
  BLUE = "6",
  ORANGE = "1",
  GREEN = "8",
}
