import React from 'react/addons';

// comment above class
export class MyComponent extends React.Component {
  componentDidMount() {

  }

  static defaultProps = {
    foo: 42,
  };

  // comment related to render method
  // this will be attached to render method
  render() {
    return <div />;
  }

  // comment on constructor
  constructor(props, context) {
    super(props, context);
  }

  static someStaticThing() {
    // should bundle with other statics
  }

  // should be before defaultProps
  static propTypes = {

  };

  myOwnMethod(foo) {
    // comment within method
  }
}

