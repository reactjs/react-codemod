const { PropTypes } = require('react');
const {
  requireNativeComponent,
  View,
  ViewPropTypes
} = require('react-native');

const Foo = requireNativeComponent('Foo');

function MyComponent(props) {
  return <View {...props}><Foo /></View>;
}

MyComponent.propTypes = ViewPropTypes;

module.exports = MyComponent;
