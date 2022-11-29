import React, { PureComponent } from 'react/addons';

const propTypes = {};

// comment above class
class MyPureComponent extends PureComponent {
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

MyPureComponent.propTypes = propTypes;

/* comment at end */
module.exports = MyPureComponent;
