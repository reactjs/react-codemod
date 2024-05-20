import { useContext } from "react";
import ThemeContext from "./ThemeContext";

function Component({
  appUrl,
}: {
  appUrl: string;
}) {
  const theme = useContext(ThemeContext);
  return <div />;
};