
var h = require('react-hyperscript');

function foo() {
  var a = h(Foo, { foo: 'bar', bar: this.state.baz });
  var b = h('div', { foo: 'bar', bar: this.state.baz });
}
