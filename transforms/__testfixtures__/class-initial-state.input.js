import React from 'React';

/*
 * Multiline
 */
var MyComponent = React.createClass({
  getInitialState: function() {
    var x = this.props.foo;
    return {
      heyoo: 23,
    };
  },

  foo: function(): void {
    this.setState({heyoo: 24});
  },
});

var ComponentWithBothPropsAndContextAccess = React.createClass({
  contextTypes: {
    name: React.PropTypes.string,
  },

  // we actually _don't_ need a constructor here since this will be
  // initialized after a proper super(props, context) call.
  // in other words, `this` will be ready when it reaches here.
  getInitialState: function() {
    return {
      foo: this.props.foo,
      bar: this.context.bar,
    };
  },

  render: function() {
    return (
      <div>{this.context.name}</div>
    );
  },
});

const App = React.createClass({
  getInitialState() {
    const state = this.calculateState(); // _might_ use `this.context`
    return state;
  },
  calculateState() {
    return { color: this.context.color };
  },
  render() {
    return <div />;
  },
});

const App2 = React.createClass({
  getInitialState() {
    const state = {
      whatever: this.context.whatever,
    };
    return state;
  },
  render() {
    return <div />;
  },
});

App.contextTypes = {
  whatever: React.PropTypes.object,
};

var MyComponent2 = React.createClass({
  getInitialState: function() {
    var x = this.props.foo.bar.wow.so.deep;
    return {
      heyoo: 23,
    };
  },

  foo: function(): void {
    this.setState({heyoo: 24});
  },
});

const getContextFromInstance = (x) => x.context; // meh

var MyComponent3 = React.createClass({
  getInitialState: function() {
    var x = getContextFromInstance(this);
    return {
      heyoo: x,
    };
  },

  foo: function(): void {
    this.setState({heyoo: 24});
  },
});

var MyComponent4 = React.createClass({
  getInitialState: function() {
    return {
      heyoo: getContextFromInstance(this),
    };
  },

  foo: function(): void {
    this.setState({heyoo: 24});
  },
});
