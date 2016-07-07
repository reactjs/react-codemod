/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @providesModule FooBar
 * @typechecks
 * @flow
 */
var React = require('React');

class ComponentWithOnlyPureRenderMixin extends React.PureComponent {
  state = {
    counter: this.props.initialNumber + 1,
  };

  render() {
    return (
      <div>{this.state.counter}</div>
    );
  }
}
