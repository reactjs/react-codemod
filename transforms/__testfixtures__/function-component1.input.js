import React, { Component, PropTypes } from 'react';

export default class HelloWorldComponent extends Component {
  render() {
    return (
      <div>Hello World</div>
    );
  }
}

class HelloNameComponent extends Component {
  render() {
    return (
      <div>Hello { this.props.name }</div>
    );
  }
}

export class ComponentWithUnknownFunction extends Component {
  componentDidMount() {
    console.log('mounted yo');
  }

  render() {
    return (
      <div>Hello { this.props.name }</div>
    );
  }
}

class ComponentWithRefs extends Component {
  render() {
    return (
      <div ref="hellodiv">Hello World</div>
    );
  }
}

class ComponentWithPropTypes extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  }

  render() {
    return (
      <div>Hello { this.props.name }</div>
    );
  }
}

class ComponentWithDefaultProps extends Component {
  static defaultProps = {
    name: 'Jordan'
  }

  render() {
    return (
      <div>Hello { this.props.name }</div>
    );
  }
}

class ComponentWithSimpleConstructor extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>Hello World</div>
    );
  }
}

class ComponentWithComplexConstructor extends Component {
  constructor(props) {
    console.log('yo');
    super(props);
  }

  render() {
    return (
      <div>Hello World</div>
    );
  }
}

class ComponentWithDestructuring extends Component {
  render() {
    const { name } = this.props;

    return (
      <div>Hello { name }</div>
    );
  }
}

class ComponentWithReferenceToProps extends Component {
  render() {
    console.log(this.props);

    return (
      <div>Hello { this.props.name }</div>
    );
  }
}

class ComponentPassingThis extends Component {
  render() {
    return (
      <SomeOtherComponent someComponent={this} />
    );
  }
}

class ComponentWithContext extends Component {
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}

ComponentWithContext.contextTypes = {
  color: PropTypes.string
};
