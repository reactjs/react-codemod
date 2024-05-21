import * as React from "react";

class ParentComponent extends React.Component {
  // Actual code probably has more accurate types.
  // Codemod might cause TypeScript errors but these are good errors since they reveal unsound code.
  refs: Record<string, any>;

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
