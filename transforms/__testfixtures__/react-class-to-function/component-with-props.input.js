import React, { Component } from "react";
import { string, number } from "prop-types";

export default class ReactExample extends Component {
  static propTypes = {
    foo: string,
    bar: number
  };
  render() {
    return (
      <div>
        {this.props.foo}
        {this.props.bar}
      </div>
    );
  }
}