'use strict';

var React = require('React');

const shadow = 'shadow';

function doSomething(props) { return props; }

class ShouldDestsructure extends React.Component {
  render() {
    return <div className={this.props.foo} />;
  }
}

class ShouldDestructureAndRemoveDuplicateDeclaration extends React.Component {
  render() {
    const fizz = { buzz: 'buzz' };
    const bar = this.props.bar;
    const baz = this.props.bizzaz;
    const buzz = fizz.buzz;
    return <div className={this.props.foo} bar={bar} baz={baz} buzz={buzz} />;
  }
}

class UsesThisDotProps extends React.Component {
  render() {
    doSomething(this.props);
    return <div className={this.props.foo} />;
  }
}

class DestructuresThisDotProps extends React.Component {
  // would be nice to destructure in this case
  render() {
    const { bar } = this.props;
    return <div className={this.props.foo} bar={bar} />;
  }
}

class HasShadowProps extends React.Component {
  render() {
    return <div shadow={shadow} propsShadow={this.props.shadow} />;
  }
}

class PureWithTypes extends React.Component {
  props: { foo: string };
  render() {
    return <div className={this.props.foo} />;
  }
}
