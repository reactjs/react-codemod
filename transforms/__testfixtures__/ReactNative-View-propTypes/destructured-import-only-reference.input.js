import { PropTypes } from 'react';
import { requireNativeComponent, View } from 'react-native';

const Foo = requireNativeComponent('Foo');

function MyComponent(props) {
  return <Foo {...props} />;
}

MyComponent.propTypes = View.propTypes;

module.exports = MyComponent;
