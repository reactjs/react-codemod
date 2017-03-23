const PropTypes = require('react');
const {
  Animated
} = require('react-native');

const ViewPropTypes = require('ViewPropTypes');

function MyComponent(props) {
  return <Animated.View {...props} />;
}

MyComponent.propTypes = ViewPropTypes;

module.exports = MyComponent;
