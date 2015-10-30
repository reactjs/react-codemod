var React = require('React');

function foo() {
  var a = React.createElement(Foo, { foo: 'bar', bar: this.state.baz });
  var b = React.createElement('div', { foo: 'bar', bar: this.state.baz });
}
