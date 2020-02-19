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

class ImpureWithRef extends React.Component {
  render() {
    return (
      <div>
        <span ref="spanasaurus" />
      </div>
    );
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

class ImpureClassProperty extends React.Component {
  state = { foo: 2 };
  render() {
    return <div />;
  }
}

class ImpureClassPropertyWithTypes extends React.Component {
  state: { x: string };
  render() {
    return <div />;
  }
}

class PureWithPropTypes extends React.Component {
  static propTypes = { foo: React.PropTypes.string };
  static foo = 'bar';
  render() {
    return <div>{this.props.foo}</div>;
  }
}

class PureWithPropTypes2 extends React.Component {
  props: { foo: string };
  static propTypes = { foo: React.PropTypes.string };
  render() {
    return <div>{this.props.foo}</div>;
  }
}

var A = props => <div className={props.foo} />;
