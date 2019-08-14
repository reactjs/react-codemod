var React = require('react/addons');

// comment above createClass
var MyComponent = React.createClass({
  // comment on componentDidMount
  componentDidMount() {},

  mixins: [PureRenderMixin],

  myOwnMethod(foo) {
    // comment within method
  },

  renderChild: function() {
    return <div />;
  },

  render: function() {
    return renderChild();
  },
});

/* comment at end */
module.exports = MyComponent;
