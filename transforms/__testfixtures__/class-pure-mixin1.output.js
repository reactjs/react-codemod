var React = require('React');

class ComponentWithOnlyPureRenderMixin extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      counter: props.initialNumber + 1,
    };
  }

  render() {
    return (
      <div>{this.state.counter}</div>
    );
  }
}
