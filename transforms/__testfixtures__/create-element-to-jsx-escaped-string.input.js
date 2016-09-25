var React = require('React');

React.createElement(Foo, {bar: 'abc'});
React.createElement(Foo, {bar: 'a\nbc'});
React.createElement(Foo, {bar: 'ab\tc'});
React.createElement(Foo, {bar: 'ab"c'});
React.createElement(Foo, {bar: "ab'c"});
