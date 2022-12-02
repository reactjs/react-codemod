import React from 'react';

export class SortCompExample extends React.Component {
  model = new Date();

  static y = 8;

  static x = 42;

  static propTypes = {};

  componentDidMount() {
    console.log('componentDidMount');
  }

  constructor(props, context) {
    super(props, context);

    console.log(this);
  }

  static defaultProps = {
    disabled: false,
  };

  someMethod2 = () => {};

  state = {
    isDataReady: false,
  };

  onBar() {}

  handleBar = () => {
  };

  set foo(value) {
    this.xx = value;
  }

  handleBar2() {}

  handleFoo() {}

  handleFoo1 = () => {};

  onBar1 = () => {};

  renderFoo() {}

  onFoo() {}

  onFoo1 = () => {};

  get foo() {
    return 42;
  }

  static track() {}

  setRef = (comp) => {
    this.panelRef = comp;
  };

  methodFoo = () => {};

  someMethod1() {
    return 42;
  }

  renderBar() {}

  render() {
    return (<div ref={this.setRef}>X</div>);
  }
}
