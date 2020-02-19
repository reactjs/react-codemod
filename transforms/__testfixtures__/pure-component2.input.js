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

class PureWithoutProps extends React.Component {
  render() {
    return <div />;
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

class PureWithPropTypes extends React.Component {
  static propTypes = { foo: React.PropTypes.string };
  render() {
    return <div>{this.props.foo}</div>;
  }
}

var A = props => <div className={props.foo} />;
