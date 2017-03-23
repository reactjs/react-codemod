const Animated = require('Animated');
const React = require('React');
const ViewPropTypes = require('ViewPropTypes');

import type { Foo } from 'Foo';

function MyComponent(): Foo {
  return React.createElement(Animated.View);
}

MyComponent.propTypes = {
  style: ViewPropTypes.style
};

module.exports = MyComponent;
