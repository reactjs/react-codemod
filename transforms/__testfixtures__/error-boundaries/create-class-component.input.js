var React = require("react");
var createClass = require("create-react-class");

var ComponentOne = createClass({
  render: function() {
    return <div />;
  },
  unstable_handleError: function(error) {}
});

var ComponentTwo = createClass({
  render() {
    return <div />;
  },
  unstable_handleError(error) {}
});

module.exports = { ComponentOne, ComponentTwo };
