import React from 'React';
import dontPruneMe from 'foobar';

class ComponentWithOnlyPureRenderMixin extends React.PureComponent {
  state = {
    counter: this.props.initialNumber + 1,
  };

  render() {
    dontPruneMe();
    return (
      <div>{this.state.counter}</div>
    );
  }
}
