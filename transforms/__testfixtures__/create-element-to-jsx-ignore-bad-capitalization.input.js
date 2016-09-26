var React = require('React');

React.createElement(Foo);
React.createElement(foo);
React.createElement('Foo');
React.createElement('foo');
React.createElement(_foo);
React.createElement('_foo');
React.createElement(foo.bar);
React.createElement(Foo, null, React.createElement(foo));
