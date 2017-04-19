/* @flow */

import React from 'React';

type SomeState = {foo: string};

// only needs props
var MyComponent = React.createClass({
  getInitialState: function(): {heyoo: number} {
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

  // we actually don't need a constructor here since this will be
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
  getInitialState(): SomeState {
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
      whatever: this.context.whatever, // needs context
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
    var x = getContextFromInstance(this); // `this` is referenced alone
    return {
      heyoo: x,
    };
  },

  foo: function(): void {
    this.setState({heyoo: 24});
  },
});

// we are not sure what you'll need from `this`,
// so it's safe to defer `state`'s initialization
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

// but only accessing `this.props` and/or `this.context` is safe
var MyComponent5 = React.createClass({
  getInitialState: function() {
    return {
      heyoo: getContextFromInstance(this.props),
    };
  },

  foo: function(): void {
    this.setState({heyoo: 24});
  },
});

// intense control flow testing
var Loader = React.createClass({
  getInitialState() {
    if (this.props.stuff) {
      return {x: 1};
    } else if (this.props.thing) {
      return {x: 2};
    }
    switch (this.props.wow) {
      case 1:
        return this.props.lol ?
          {x: 3} :
          this.whatever(this.props);
    }
    for (let i = 0; i < 100; i++) {
      if (i === 20) {
        return {x: i};
      }
    }

    try {
      doSomeThingReallyBad();
    } catch (e) {
      return {error: e};
    }

    return this.lol();
  },

  render() {
    return null;
  },
});

var FunctionDeclarationInGetInitialState = React.createClass({
  getInitialState() {
    function func() {
      var x = 1;
      return x; // dont change me
    }

    const foo = () => {
      return 120; // dont change me
    };

    var q = function() {
      return 100; // dont change me
    };

    return {
      x: func(),
      y: foo(),
      z: q(),
    };
  },

  render() {
    return null;
  },
});

var DeferStateInitialization = React.createClass({
  getInitialState() {
    return {x: this.something};
  },

  something: 42,

  render() {
    return <div onClick={this.reset} />;
  },
});

var helper = () => {};

// fallback
var PassGetInitialState = React.createClass({
  getInitialState() {
    return this.lol();
  },

  helper1: function() {
    helper(this.getInitialState);
  },

  render() {
    return null;
  },
});

// fallback
var UseGetInitialState = React.createClass({
  getInitialState() {
    return this.lol();
  },

  helper2() {
    this.setState(this.getInitialState());
  },

  render() {
    return null;
  },
});

// fallback
var UseArguments = React.createClass({
  helper() {
    console.log(arguments);
  },

  render() {
    return null;
  },
});

// fallback
var ShadowingIssue = React.createClass({
  getInitialState() {
    const props = { x: 123 };
    return { x: props.x };
  },

  render() {
    return null;
  },
});

// will remove unnecessary bindings
var ShadowingButFine = React.createClass({
  getInitialState() {
    const props = this.props;
    const context = this.context;
    return { x: props.x + context.x };
  },

  render() {
    return null;
  },
});

// move type annotations
var WithSimpleType = React.createClass({
  getInitialState(): Object {
    return {
      x: 12,
      y: 13,
      z: 14,
    };
  },

  render() {
    return null;
  },
});

var WithLongType = React.createClass({
  getInitialState(): {name: string, age: number, counter: number} {
    return {
      name: 'Michael',
      age: 23,
      count: 6,
    };
  },

  render() {
    return null;
  },
});

var WithMultiLineType = React.createClass({
  getInitialState(): {
    nameLists: Array<Array<string>>,
    age?: ?number,
    counter?: ?number,
  } {
    return {
      nameLists: [['James']],
      count: 1400,
      foo: 'bar',
    };
  },

  render() {
    return null;
  },
});

var WithArrowFunction = React.createClass({
  getInitialState: (): {heyoo: number} => {
    return {
      heyoo: 23,
    };
  },

  render() {
    return null;
  },
});

var WithArrowFunctionAndObject = React.createClass({
  getInitialState: (): {heyoo: number} => ({
    heyoo: 23,
  }),

  render() {
    return null;
  },
});
