var h = require('react-hyperscript');

function foo() {
  var a = <Foo foo="bar" bar={this.state.baz} />;
  var b = <div foo="bar" bar={this.state.baz} />;
}
