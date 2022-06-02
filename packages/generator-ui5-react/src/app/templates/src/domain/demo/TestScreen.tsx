import { observer } from "@cpro/react-core";
import React, { FC } from "react";

export const TestScreen: FC<{}> = observer(() => {
  return (
    <section>
      <h2>Hello World!</h2>
      <p>Whatever....</p>
    </section>
  );
});
