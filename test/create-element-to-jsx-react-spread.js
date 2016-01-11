var React = require('react/addons');

React.createElement(Foo, React.__spread({
  'foo': 'bar',
}, props, {
  'bar': 'foo',
}));
