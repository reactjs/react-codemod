/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 * @flow
 */
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
