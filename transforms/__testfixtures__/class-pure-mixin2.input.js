import React from 'React';
import WhateverYouCallIt from 'react-addons-pure-render-mixin';
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
