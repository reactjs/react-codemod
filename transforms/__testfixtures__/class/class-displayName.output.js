const React = require('React');

const createReactClass = require('create-react-class');

let A = createReactClass({
  displayName: 'A',
  mixins: [],

  render() {
    return <div />;
  },
});

A = createReactClass({
  displayName: 'A',
  mixins: [],

  render() {
    return <div />;
  },
});

const obj = {
  B: createReactClass({
    displayName: 'B',
    mixins: [],

    render() {
      return <div />;
    },
  }),
};

export default createReactClass({
  displayName: 'class-displayName.input',
  mixins: [],

  render() {
    return <div />;
  },
});
