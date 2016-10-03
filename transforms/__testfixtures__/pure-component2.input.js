'use strict';

var React = require('React');

function render() {
  return <div/>;
}

class Pure extends React.Component {
  render() {
    return <div className={this.props.foo} />;
  }
}

class Impure extends React.Component {
  componentWillMount() {
    // such impure
  }
  render() {
    return <div className={this.props.foo} />;
  }
}

class PureWithTypes extends React.Component {
  props: { foo: string };
  render() {
    return <div className={this.props.foo} />;
  }
}

type Props = { foo: string };

class PureWithTypes2 extends React.Component {
  props: Props;
  render() {
    return <div className={this.props.foo} />;
  }
}

var A = props => <div className={props.foo} />;
