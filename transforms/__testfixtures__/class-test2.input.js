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

var ComponentWithBothPropsAndContextAccess = React.createClass({
  contextTypes: {
    name: React.PropTypes.string,
  },

  getInitialState: function() {
    return {
      foo: this.props.foo,
    };
  },

  render: function() {
    return (
      <div>{this.context.name}</div>
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
