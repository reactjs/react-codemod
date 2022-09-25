import * as React from "react";

class ParentComponent extends React.Component {
  render() {
    const refName = "P";
    // Giving up. Would need to implement scope tracking.
    return <div ref={refName} id="P"></div>;
  }
}
