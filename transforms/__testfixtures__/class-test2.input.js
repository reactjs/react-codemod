'use strict';

var React = require('React');
var ReactComponentWithPureRenderMixin = require('ReactComponentWithPureRenderMixin');
var FooBarMixin = require('FooBarMixin');

var ComponentWithNonSimpleInitialState = React.createClass({
  statics: {
    iDontKnowWhyYouNeedThis: true, // but comment it
    foo: 'bar',
    dontBindMe: function(count: number): any {
      return this;
    },
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

var listOfInconvertibleMixins = [ReactComponentWithPureRenderMixin, FooBarMixin];

var ComponentWithInconvertibleMixins2 = React.createClass({
  mixins: listOfInconvertibleMixins,

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

// taken from https://facebook.github.io/react/docs/context.html#updating-context
var MediaQuery = React.createClass({
  childContextTypes: {
    type: React.PropTypes.string,
  },

  getInitialState: function() {
    return {type:'desktop'};
  },

  getChildContext: function() {
    return {type: this.state.type};
  },

  componentDidMount: function() {
    const checkMediaQuery = () => {
      const type = window.matchMedia('(min-width: 1025px)').matches ? 'desktop' : 'mobile';
      if (type !== this.state.type) {
        this.setState({type});
      }
    };

    window.addEventListener('resize', checkMediaQuery);
    checkMediaQuery();
  },

  render: function() {
    return this.props.children;
  },
});
