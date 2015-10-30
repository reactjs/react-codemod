var React = require('React');

var a = React.createElement(
  Foo,
  null,
  React.createElement('div', { foo: 'bar' }),
  React.createElement(
    'span',
    null,
    'blah'
  )
);
