import { createRoot } from "react-dom/client";
import { render } from "react-dom";

const fn = () => {
  if (true) {
    const root = createRoot(theNode);
    root.render(<Component />);
  }
};
