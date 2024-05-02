import { Component, PureComponent } from "react";

class C extends Component {
  render() {
    return <div ref="refName" />;
  }
}

class C1 extends PureComponent {
  render() {
    return <div ref="refName" />;
  }
}
