var React = require('react/addons');

// comment above createClass
var MyComponent = React.createClass({
  // comment at top of createClass
  // this will be attached to first method

  render: function() {
    return <div />;
  },

  mixins: [PureRenderMixin],

  // comment on componentDidMount
  componentDidMount() {
  },

  renderFoo() {
    // other render* function
  },

  renderBar() {
    // should come before renderFoo
  },

  myOwnMethod(foo) {
    // comment within method
  },

  propTypes: {
    foo: bar, // comment on prop
  },

});

/* comment at end */
module.exports = MyComponent;
