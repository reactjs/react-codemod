import { PropTypes } from 'react';
import { requireNativeComponent } from 'react-native';

import ViewPropTypes from 'ViewPropTypes';

const Foo = requireNativeComponent('Foo');

function MyComponent(props) {
  return <Foo {...props} />;
}

MyComponent.propTypes = ViewPropTypes;

module.exports = MyComponent;
