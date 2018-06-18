var h = require('react-hyperscript');

h(Foo, {bar: 'abc'});
h(Foo, {bar: 'a\nbc'});
h(Foo, {bar: 'ab\tc'});
h(Foo, {bar: 'ab"c'});
h(Foo, {bar: "ab'c"});
