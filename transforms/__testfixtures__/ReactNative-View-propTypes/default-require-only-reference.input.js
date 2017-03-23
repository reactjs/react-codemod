const Animated = require('Animated');
const React = require('React');
const View = require('View');

function MyComponent() {
  return React.createElement(Animated.View);
}

MyComponent.propTypes = {
  style: View.propTypes.style
};

module.exports = MyComponent;
