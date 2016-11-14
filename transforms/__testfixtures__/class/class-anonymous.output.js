var React = require('react');

const wrapper = (x) => x;

const Foo = wrapper(class extends React.Component {
  render() {
    return <div>wow so anonymous</div>;
  }
});

module.exports = wrapper(class extends React.Component {
  render() {
    return <div>wow so anonymous</div>;
  }
});

export default wrapper(class extends React.Component {
  render() {
    return <div>wow so anonymous</div>;
  }
});
