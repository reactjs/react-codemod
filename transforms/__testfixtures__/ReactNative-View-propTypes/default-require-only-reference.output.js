const Animated = require('Animated');
const React = require('React');
const ViewPropTypes = require('ViewPropTypes');

function MyComponent() {
  return React.createElement(Animated.View);
}

MyComponent.propTypes = {
  style: ViewPropTypes.style
};

module.exports = MyComponent;
