var React = require('react/addons');

const propTypes = {};

// comment above class
class MyComponent extends React.Component {
  // comment at top of createClass
  // this will be attached to first method

  render() {
    return <div />;
  }

  // comment on componentDidMount
  componentDidMount() {
  }

  static someStaticThing() {
    // should come first
  }

  renderFoo() {
    // other render* function
  }

  renderBar() {
    // should come before renderFoo
  }

  myOwnMethod(foo) {
    // comment within method
  }

}

MyComponent.propTypes = propTypes;

/* comment at end */
module.exports = MyComponent;