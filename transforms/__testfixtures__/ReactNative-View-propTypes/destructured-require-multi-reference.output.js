const { PropTypes } = require('react');
const { requireNativeComponent, View } = require('react-native');

const ViewPropTypes = require('ViewPropTypes');

const Foo = requireNativeComponent('Foo');

function MyComponent(props) {
  return <View {...props}><Foo /></View>;
}

MyComponent.propTypes = ViewPropTypes;

module.exports = MyComponent;
