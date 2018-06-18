var h = require('react-hyperscript');

<Foo bar="abc" />;
<Foo bar={'a\nbc'} />;
<Foo bar={'ab\tc'} />;
<Foo bar={'ab"c'} />;
<Foo bar="ab'c" />;
