'use strict';

var React = require('React');
var ReactComponentWithPureRenderMixin = require('ReactComponentWithPureRenderMixin');
var FooBarMixin = require('FooBarMixin');

class ComponentWithNonSimpleInitialState extends React.Component {
  static iDontKnowWhyYouNeedThis = true; // but comment it
  static foo = 'bar';

  constructor(props, context) {
    super(props, context);

    this.state = {
      counter: props.initialNumber + 1,
    };
  }

  render() {
    return (
      <div>{this.state.counter}</div>
    );
  }
}

// Comment
module.exports = class extends React.Component {
  static propTypes = {
    foo: React.PropTypes.bool,
  };

  static defaultProps = {
    foo: 12,
  };

  constructor(props, context) {
    super(props, context);
    // non-simple getInitialState
    var data = 'bar';

    this.state = {
      bar: data,
    };
  }

  render() {
    return <div />;
  }
};

class ComponentWithOnlyPureRenderMixin extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      counter: props.initialNumber + 1,
    };
  }

  render() {
    return (
      <div>{this.state.counter}</div>
    );
  }
}

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
