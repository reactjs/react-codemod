'use strict';

var React = require('React');

var ComponentWithNonSimpleInitialState = React.createClass({
  statics: {
    iDontKnowWhyYouNeedThis: true, // but comment it
    foo: 'bar',
  },

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

// Comment
module.exports = React.createClass({
  propTypes: {
    foo: React.PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      foo: 12,
    };
  },

  getInitialState: function() { // non-simple
    var data = 'bar';
    return {
      bar: data,
    };
  },

  render: function() {
    return <div />;
  },
});
