import React from 'react/addons';

// comment above class
export class MyComponent extends React.PureComponent {
  // comment related to render method
  // this will be attached to render method
  render() {
    return <div />;
  }

  // comment on componentDidMount
  componentDidMount() {
  }

  // foo getter comment
  get foo() {
    return 42;
  }

  set foo(value) {
    this.instanceVariable = value;
  }

  static someStaticThing() {
    // should bundle with other statics
  }

  get bar() {

  }

  set bar(value) {

  }

  renderFoo() {
    // other render* function
  }

  instanceVariable;

  renderBar() {
    // should come before renderFoo
  }

  static aStaticThing() {
    // should come first
  }

  myOwnMethod(foo) {
    // comment within method
  }
}

