import React, { Component } from 'react/addons';

const propTypes = {};

// comment above class
class MyComponent extends Component {
  static aStaticThing() {
    // should come first
  }

  static someStaticThing() {
    // should bundle with other statics
  }

  // comment on componentDidMount
  componentDidMount() {
  }

  myOwnMethod(foo) {
    // comment within method
  }

  renderBar() {
    // should come before renderFoo
  }

  renderFoo() {
    // other render* function
  }

  // comment at top of createClass
  // this will be attached to first method

  render() {
    return <div />;
  }

}

MyComponent.propTypes = propTypes;

/* comment at end */
module.exports = MyComponent;
