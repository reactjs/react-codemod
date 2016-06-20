import React from 'React';
import dontPruneMe from 'foobar';

class ComponentWithOnlyPureRenderMixin extends React.PureComponent {
  constructor(props) {
    super(props);

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
