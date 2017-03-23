const PropTypes = require('react');
const { Animated, ViewPropTypes } = require('react-native');

function MyComponent(props) {
  return <Animated.View {...props} />;
}

MyComponent.propTypes = ViewPropTypes;

module.exports = MyComponent;
