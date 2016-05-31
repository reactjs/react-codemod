var React = require('react/addons');

// comment above createClass
var MyComponent = React.createClass({
  render: function() {
    return <div />;
  },

  mixins: [PureRenderMixin],

  // comment on componentDidMount
  componentDidMount() {},

  myOwnMethod(foo) {
    // comment within method
  },

});

/* comment at end */
module.exports = MyComponent;
