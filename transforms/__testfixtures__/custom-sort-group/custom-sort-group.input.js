var React = require('react/addons');

// comment above createClass
var MyComponent = React.createClass({
  render: function() {
    return renderChild();
  },

  mixins: [PureRenderMixin],

  // comment on componentDidMount
  componentDidMount() {},

  myOwnMethod(foo) {
    // comment within method
  },

  renderChild: function() {
    return <div />;
  },
});

/* comment at end */
module.exports = MyComponent;
