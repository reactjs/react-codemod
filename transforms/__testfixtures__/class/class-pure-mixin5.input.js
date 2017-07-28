// dont remove me
var React = require('React'),
  ReactComponentWithPureRenderMixin = require('ReactComponentWithPureRenderMixin');

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
