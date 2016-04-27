'use strict';

var React = require('React');

function render() {
  return <div/>;
}

const Pure = props => {
  return <div className={props.foo} />;
};

class Impure extends React.Component {
  componentWillMount() {
    // such impure
  }
  render() {
    return <div className={this.props.foo} />;
  }
}

var A = props => <div className={props.foo} />;
