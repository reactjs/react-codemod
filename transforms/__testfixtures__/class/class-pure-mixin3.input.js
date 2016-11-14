// for this file we disable the `pure-component` option
// so the output should be just nothing
var React = require('React');
var ReactComponentWithPureRenderMixin = require('ReactComponentWithPureRenderMixin');

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
