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

const PureWithoutProps = () => {
  return <div />;
};

const PureWithTypes = (props: { foo: string }) => {
  return <div className={props.foo} />;
};

type Props = { foo: string };

const PureWithTypes2 = (props: Props) => {
  return <div className={props.foo} />;
};

const PureWithPropTypes = props => {
  return <div>{props.foo}</div>;
};

PureWithPropTypes.propTypes = { foo: React.PropTypes.string };

var A = props => <div className={props.foo} />;
