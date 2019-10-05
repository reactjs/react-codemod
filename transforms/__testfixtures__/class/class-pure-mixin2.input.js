/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 * @flow
 */
import WhateverYouCallIt from 'react-addons-pure-render-mixin';
import React from 'React';
import dontPruneMe from 'foobar';

var ComponentWithOnlyPureRenderMixin = React.createClass({
  mixins: [WhateverYouCallIt],

  getInitialState: function() {
    return {
      counter: this.props.initialNumber + 1,
    };
  },

  render: function() {
    dontPruneMe();
    return (
      <div>{this.state.counter}</div>
    );
  },
});
