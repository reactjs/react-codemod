// for this file we disable the `pure-component` option
// so we should not convert to a plain class
var React = require('React');
var createReactClass = require('create-react-class');
var ReactComponentWithPureRenderMixin = require('ReactComponentWithPureRenderMixin');

var ComponentWithOnlyPureRenderMixin = createReactClass({
  displayName: 'ComponentWithOnlyPureRenderMixin',
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
