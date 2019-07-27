DOM = 'this is a test!';

foo.DOM = {};

foo.DOM.div = () => null;

const bar = foo.DOM.div('a', 'b', 'c');