var h = require('react-hyperscript');

h('div', {}, [
    h('span', {}, [
        h('button', {}, [
            h('a', {href: 'https://www.google.com'}, [
                h('audio')
            ]),
        ]),
        h('br'),
        h('img')
    ])
]);
