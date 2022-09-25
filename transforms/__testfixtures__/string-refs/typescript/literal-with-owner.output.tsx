import * as React from "react";

class ParentComponent extends React.Component {
  // Actual code probably has more accurate types.
  // Codemod might cause TypeScript errors but these are good errors since they reveal unsound code.
  refs: Record<string, any>;

  render() {
    return (
      <div ref={current => {
        this.refs['P'] = current;
      }} id="P">
        <div ref={current => {
          this.refs['P_P1'] = current;
        }} id="P_P1">
          <span ref={current => {
            this.refs['P_P1_C1'] = current;
          }} id="P_P1_C1" />
          <span ref={current => {
            this.refs['P_P1_C2'] = current;
          }} id="P_P1_C2" />
        </div>
        <div ref={current => {
          this.refs['P_OneOff'] = current;
        }} id="P_OneOff" />
      </div>
    );
  }
}
