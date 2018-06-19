var h = require('react-hyperscript');

h(Foo);
h(foo);
h('Foo');
h('foo');
h(_foo);
h('_foo');
h(foo.bar);
h(Foo, {}, [h(foo)]);
