import React from 'react/addons';

// comment above class
export class MyComponent extends React.Component {
  static someStaticThing() {
    // should bundle with other statics
  }

  // should be before defaultProps
  static propTypes = {

  };

  static defaultProps = {
    foo: 42,
  };

  // comment on constructor
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {

  }

  myOwnMethod(foo) {
    // comment within method
  }

  // comment related to render method
  // this will be attached to render method
  render() {
    return <div />;
  }
}

