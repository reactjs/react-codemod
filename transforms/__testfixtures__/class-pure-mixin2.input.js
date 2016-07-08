/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @providesModule Bar
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
