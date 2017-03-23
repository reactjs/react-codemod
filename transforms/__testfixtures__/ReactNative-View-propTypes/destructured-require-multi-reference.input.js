const { PropTypes } = require('react');
const { requireNativeComponent, View } = require('react-native');

const Foo = requireNativeComponent('Foo');

function MyComponent(props) {
  return <View {...props}><Foo /></View>;
}

MyComponent.propTypes = View.propTypes;

module.exports = MyComponent;
