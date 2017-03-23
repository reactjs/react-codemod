const PropTypes = require('react');
const { Animated, View } = require('react-native');

function MyComponent(props) {
  return <Animated.View {...props} />;
}

MyComponent.propTypes = View.propTypes;

module.exports = MyComponent;
