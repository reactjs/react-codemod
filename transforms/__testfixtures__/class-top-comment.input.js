/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @providesModule FooBar
 * @typechecks
 * @flow
 */
var ReactComponentWithPureRenderMixin = require('ReactComponentWithPureRenderMixin');
var React = require('React');

var ComponentWithOnlyPureRenderMixin = React.createClass({
  mixins: [ReactComponentWithPureRenderMixin],

  getInitialState: function() {
    return {
      counter: this.props.initialNumber + 1,
    };
  },

  render: function() {
    return (
      <div>{this.state.counter}</div>
    );
  },
});
