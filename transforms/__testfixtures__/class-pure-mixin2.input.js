import React from 'React';
import WhateverYouCallIt from 'react-addons-pure-render-mixin';

var ComponentWithOnlyPureRenderMixin = React.createClass({
  mixins: [WhateverYouCallIt],

  getInitialState: function() {
    return {
      counter: this.props.initialNumber + 1,
    };
  },

  render: function() {
    return (
      <div>{this.state.counter}</div>
    );
  },
});
