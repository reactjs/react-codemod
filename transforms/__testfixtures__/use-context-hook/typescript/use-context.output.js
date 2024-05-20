import { use } from "react";
import ThemeContext from "./ThemeContext";

function Component({
  appUrl,
}: {
  appUrl: string;
}) {
  const theme = use(ThemeContext);
  return <div />;
};