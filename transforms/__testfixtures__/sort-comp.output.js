var React = require('react/addons');

// comment above createClass
var MyComponent = React.createClass({
  propTypes: {
    foo: bar, // comment on prop
  },

  mixins: [PureRenderMixin],

  // comment on componentDidMount
  componentDidMount() {
  },

  myOwnMethod(foo) {
    // comment within method
  },

  renderBar() {
    // should come before renderFoo
  },

  renderFoo() {
    // other render* function
  },

  // comment at top of createClass
  // this will be attached to first method

  render: function() {
    return <div />;
  },

});

/* comment at end */
module.exports = MyComponent;
