'use strict';

var React = require('React');

class ComponentWithNonSimpleInitialState extends React.Component {
  static foo = 'bar';
  static iDontKnowWhyYouNeedThis = true; // but comment it

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
  static defaultProps = {
    foo: 12,
  };

  static propTypes = {
    foo: React.PropTypes.bool,
  };

  state = function() { // non-simple
    var data = 'bar';
    return {
      bar: data,
    };
  }();

  render() {
    return <div />;
  }
};
