var h = require('react-hyperscript');

<Foo />;
h(foo);
h('Foo');
<foo />;
<_foo />;
h('_foo');
<foo.bar />;
<Foo>
  {h(foo)}
</Foo>;
