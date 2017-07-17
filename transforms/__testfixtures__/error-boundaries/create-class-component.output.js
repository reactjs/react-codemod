var React = require("react");
var createClass = require("create-react-class");

var ComponentOne = createClass({
  render: function() {
    return <div />;
  },
  componentDidCatch: function(error) {}
});

var ComponentTwo = createClass({
  render() {
    return <div />;
  },
  componentDidCatch(error) {}
});

module.exports = { ComponentOne, ComponentTwo };
