import React from "react";

export class ComponentOne extends React.Component {
  componentDidCatch(error) {}
  render() {
    return <div />;
  }
}

export class ComponentTwo extends React.Component {
  componentDidCatch = error => {};
  render() {
    return <div />;
  }
}
