import * as React from "react";

class ParentComponent extends React.Component {
  render() {
    return (
      <div ref="P" id="P">
        <div ref="P_P1" id="P_P1">
          <span ref="P_P1_C1" id="P_P1_C1" />
          <span ref="P_P1_C2" id="P_P1_C2" />
        </div>
        <div ref="P_OneOff" id="P_OneOff" />
      </div>
    );
  }
}
