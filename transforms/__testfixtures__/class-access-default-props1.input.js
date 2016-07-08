/* @flow */
var React = require('react');
var OtherClass = require('OtherClass');

var NewThing = React.createClass({
  getDefaultProps: OtherClass.getDefaultProps,
  getData() {
    return OtherClass.getDefaultProps();
  },
  render() {
    return <div/>;
  },
});

var NewThing2 = React.createClass({
  getDefaultProps: function() {
    return OtherClass.defaultProps;
  },
  getData() {
    return OtherClass.getDefaultProps();
  },
  render() {
    return <div/>;
  },
});

module.exports = NewThing;
