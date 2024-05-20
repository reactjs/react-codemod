import React from "react";

class C extends React.Component {
  render() {
    return <div ref="refName" />;
  }
}

class C1 extends React.PureComponent {
  render() {
    return <div ref="refName" />;
  }
}
