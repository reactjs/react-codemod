'use strict';

var React = require('React');

function render() {
  return <div/>;
}

function Pure(props) {
  return <div className={props.foo} />;
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

function PureWithTypes(props: { foo: string }) {
  return <div className={props.foo} />;
}

type Props = { foo: string };

function PureWithTypes2(props: Props) {
  return <div className={props.foo} />;
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

var A = props => <div className={props.foo} />;
