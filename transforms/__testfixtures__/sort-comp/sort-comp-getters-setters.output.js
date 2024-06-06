import React from 'react/addons';

// comment above class
export class MyComponent extends React.PureComponent {
  static aStaticThing() {
    // should come first
  }

  static someStaticThing() {
    // should bundle with other statics
  }

  instanceVariable;

  // comment on componentDidMount
  componentDidMount() {
  }

  get bar() {

  }

  // foo getter comment
  get foo() {
    return 42;
  }

  set bar(value) {

  }

  set foo(value) {
    this.instanceVariable = value;
  }

  myOwnMethod(foo) {
    // comment within method
  }

  renderBar() {
    // should come before renderFoo
  }

  renderFoo() {
    // other render* function
  }

  // comment related to render method
  // this will be attached to render method
  render() {
    return <div />;
  }
}

