let {DOM} = require('Free');
import {DOM} from 'Free';

const foo = DOM.div('a', 'b', 'c');
const bar = Free.DOM.div('a', 'b', 'c');

DOM = 'this is a test!';

foo.DOM = {};

foo.DOM.div = () => null;

const bar = foo.DOM.div('a', 'b', 'c');
