var React = require('React');

class ComponentWithOnlyPureRenderMixin extends React.PureComponent {
  constructor(props) {
    super(props);

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
