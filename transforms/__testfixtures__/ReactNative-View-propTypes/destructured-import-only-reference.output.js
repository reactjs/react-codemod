import { PropTypes } from 'react';
import { requireNativeComponent, ViewPropTypes } from 'react-native';

const Foo = requireNativeComponent('Foo');

function MyComponent(props) {
  return <Foo {...props} />;
}

MyComponent.propTypes = ViewPropTypes;

module.exports = MyComponent;
