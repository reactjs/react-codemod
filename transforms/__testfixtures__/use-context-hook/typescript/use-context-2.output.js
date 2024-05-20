import React from "react";
import ThemeContext from "./ThemeContext";

function Component({
  appUrl,
}: {
  appUrl: string;
}) {
  const theme = React.use(ThemeContext);
  return <div />;
};