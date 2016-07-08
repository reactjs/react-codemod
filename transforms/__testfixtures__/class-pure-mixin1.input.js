// dont remove me
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
