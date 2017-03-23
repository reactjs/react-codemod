const Animated = require('Animated');
const React = require('React');
const View = require('View');

import type { Foo } from 'Foo';

function MyComponent(): Foo {
  return React.createElement(Animated.View);
}

MyComponent.propTypes = {
  style: View.propTypes.style
};

module.exports = MyComponent;
