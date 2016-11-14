const React = require('react');

const Component1 = React.createClass({
  statics: {
    booleanPrim: true,
    numberPrim: 12,
    stringPrim: 'foo',
    nullPrim: null,
    undefinedPrim: undefined,
  },
  booleanPrim: true,
  numberPrim: 12,
  stringPrim: 'foo',
  nullPrim: null,
  undefinedPrim: undefined,

  foobar: function() {
    return 123;
  },

  componentDidMount: function() {
    console.log('hello');
  },

  render: function() {
    return <div />;
  },
});
