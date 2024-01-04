import React, { PureComponent } from 'react/addons';

const propTypes = {};

// comment above class
class MyPureComponent extends PureComponent {
  // comment at top of createClass
  // this will be attached to first method

  render() {
    return <div />;
  }

  // comment on componentDidMount
  componentDidMount() {
  }

  static someStaticThing() {
    // should bundle with other statics
  }

  renderFoo() {
    // other render* function
  }

  renderBar() {
    // should come before renderFoo
  }

  static aStaticThing() {
    // should come first
  }

  myOwnMethod(foo) {
    // comment within method
  }

}

MyPureComponent.propTypes = propTypes;

/* comment at end */
module.exports = MyPureComponent;
