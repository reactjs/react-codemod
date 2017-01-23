var React = require('React');

<Foo />;
React.createElement(foo);
React.createElement('Foo');
<foo />;
<_foo />;
React.createElement('_foo');
<foo.bar />;
<Foo>
  {React.createElement(foo)}
</Foo>;
