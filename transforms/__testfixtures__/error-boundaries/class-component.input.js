import React from "react";

export class ComponentOne extends React.Component {
  unstable_handleError(error) {}
  render() {
    return <div />;
  }
}

export class ComponentTwo extends React.Component {
  unstable_handleError = error => {};
  render() {
    return <div />;
  }
}
