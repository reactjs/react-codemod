import React from 'react/addons';

// comment above class
export class MyComponent extends React.Component {
  static aStaticThing() {
    // should come first
  }

  static someStaticThing() {
    // should bundle with other statics
  }

  bar = null;

  foo;

  model = new Date();

  // comment on componentDidMount
  componentDidMount() {
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

