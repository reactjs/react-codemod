var React = require('react');

const wrapper = (x) => x;

const Foo = wrapper(React.createClass({
  render() {
    return <div>wow so anonymous</div>;
  },
}));

module.exports = wrapper(React.createClass({
  render() {
    return <div>wow so anonymous</div>;
  },
}));

export default wrapper(React.createClass({
  render() {
    return <div>wow so anonymous</div>;
  },
}));
