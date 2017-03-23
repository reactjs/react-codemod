import { PropTypes } from 'react';
import { requireNativeComponent, View } from 'react-native';

import ViewPropTypes from 'ViewPropTypes';

const Foo = requireNativeComponent('Foo');

function MyComponent(props) {
  return <View {...props}><Foo /></View>;
}

MyComponent.propTypes = ViewPropTypes;

module.exports = MyComponent;
