var h = require('react-hyperscript');

const recipient = 'world';
h('span', {}, ['Hello ', recipient]);
h('span', {}, ['Water', recipient]);