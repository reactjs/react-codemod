import React, { Component } from "react";
import { string, number } from "prop-types";

export default class ReactExample extends Component {
  static propTypes = {
    foo: string,
    bar: number
  };
  static defaultProps = {
    foo: "test",
    bar: 2
  };
  render() {
    const test = this.props.bar === 2;
    return (
      <div>
        {test}
        {this.props.bar}
      </div>
    );
  }
}