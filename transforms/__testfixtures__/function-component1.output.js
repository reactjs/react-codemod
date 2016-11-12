import React, { Component, PropTypes } from 'react';

export default function HelloWorldComponent() {
  return (
    <div>Hello World</div>
  );
}

function HelloNameComponent(
  {
    name
  }
) {
  return (
    <div>Hello { name }</div>
  );
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

function ComponentWithPropTypes(
  {
    name
  }
) {
  return (
    <div>Hello { name }</div>
  );
}

ComponentWithPropTypes.propTypes = {
  name: PropTypes.string.isRequired
};

function ComponentWithDefaultProps(
  {
    name
  }
) {
  return (
    <div>Hello { name }</div>
  );
}

ComponentWithDefaultProps.defaultProps = {
  name: 'Jordan'
};

function ComponentWithSimpleConstructor() {
  return (
    <div>Hello World</div>
  );
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

function ComponentWithDestructuring(props) {
  const { name } = props;

  return (
    <div>Hello { name }</div>
  );
}

function ComponentWithReferenceToProps(props) {
  console.log(props);

  return (
    <div>Hello { props.name }</div>
  );
}

class ComponentPassingThis extends Component {
  render() {
    return (
      <SomeOtherComponent someComponent={this} />
    );
  }
}
