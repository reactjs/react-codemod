import React1, { PureComponent as PureComponent1 } from "react";

class C extends React1.Component {
  render() {
    return (
      <div ref={(ref) => {
        this.refs.refName = ref;
      }} />
    );
  }
}

class C1 extends PureComponent1 {
  render() {
    return (
      <div ref={(ref) => {
        this.refs.refName = ref;
      }} />
    );
  }
}
