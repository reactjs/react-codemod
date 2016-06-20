import React from 'React';
import dontPruneMe from 'foobar';

class ComponentWithOnlyPureRenderMixin extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      counter: props.initialNumber + 1,
    };
  }

  render() {
    dontPruneMe();
    return (
      <div>{this.state.counter}</div>
    );
  }
}
