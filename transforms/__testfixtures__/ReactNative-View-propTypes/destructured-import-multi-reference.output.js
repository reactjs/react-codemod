import { PropTypes } from 'react';
import { requireNativeComponent, View, ViewPropTypes } from 'react-native';

const Foo = requireNativeComponent('Foo');

function MyComponent(props) {
  return <View {...props}><Foo /></View>;
}

MyComponent.propTypes = ViewPropTypes;

module.exports = MyComponent;
