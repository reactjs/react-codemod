/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
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
