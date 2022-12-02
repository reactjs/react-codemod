import React from 'react';

export class SortCompExample extends React.Component {
  static x = 42;

  static y = 8;

  static track() {}

  model = new Date();

  static propTypes = {};

  static defaultProps = {
    disabled: false,
  };

  constructor(props, context) {
    super(props, context);

    console.log(this);
  }

  state = {
    isDataReady: false,
  };

  componentDidMount() {
    console.log('componentDidMount');
  }

  handleBar = () => {
  };

  handleBar2() {}

  handleFoo() {}

  handleFoo1 = () => {};

  onBar() {}

  onBar1 = () => {};

  onFoo() {}

  onFoo1 = () => {};

  get foo() {
    return 42;
  }

  set foo(value) {
    this.xx = value;
  }

  setRef = (comp) => {
    this.panelRef = comp;
  };

  methodFoo = () => {};

  someMethod2 = () => {};

  someMethod1() {
    return 42;
  }

  renderBar() {}

  renderFoo() {}

  render() {
    return (<div ref={this.setRef}>X</div>);
  }
}
