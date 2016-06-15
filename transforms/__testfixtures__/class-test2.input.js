'use strict';

var React = require('React');
var ReactComponentWithPureRenderMixin = require('ReactComponentWithPureRenderMixin');
var FooBarMixin = require('FooBarMixin');

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

  getInitialState: function() { // non-simple getInitialState
    var data = 'bar';
    return {
      bar: data,
    };
  },

  render: function() {
    return <div />;
  },
});

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

var ComponentWithInconvertibleMixins = React.createClass({
  mixins: [ReactComponentWithPureRenderMixin, FooBarMixin],

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
