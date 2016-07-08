/* @flow */
var React = require('react');
var OtherClass = require('OtherClass');

class NewThing extends React.Component {
  static defaultProps = OtherClass.defaultProps;

  getData = () => {
    return OtherClass.defaultProps;
  };

  render() {
    return <div/>;
  }
}

class NewThing2 extends React.Component {
  static defaultProps = OtherClass.defaultProps;

  getData = () => {
    return OtherClass.defaultProps;
  };

  render() {
    return <div/>;
  }
}

module.exports = NewThing;
