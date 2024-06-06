import React from 'react/addons';

// comment above class
export class MyComponent extends React.Component {

  // comment related to render method
  // this will be attached to render method
  render() {
    return <div />;
  }

  // comment on componentDidMount
  componentDidMount() {
  }

  static someStaticThing() {
    // should bundle with other statics
  }

  renderFoo() {
    // other render* function
  }

  foo;

  bar = null;

  renderBar() {
    // should come before renderFoo
  }

  model = new Date();

  static aStaticThing() {
    // should come first
  }

  myOwnMethod(foo) {
    // comment within method
  }

}

