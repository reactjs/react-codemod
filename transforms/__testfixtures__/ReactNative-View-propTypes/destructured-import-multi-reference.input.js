import { PropTypes } from 'react';
import { requireNativeComponent, View } from 'react-native';

const Foo = requireNativeComponent('Foo');

function MyComponent(props) {
  return <View {...props}><Foo /></View>;
}

MyComponent.propTypes = View.propTypes;

module.exports = MyComponent;
