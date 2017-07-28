/* @flow */

import React from 'React';

import createReactClass from 'create-react-class';

type SomeState = {foo: string};

// only needs props
class MyComponent extends React.Component {
  state: {heyoo: number};

  constructor(props) {
    super(props);
    var x = props.foo;

    this.state = {
      heyoo: 23,
    };
  }

  foo = (): void => {
    this.setState({heyoo: 24});
  };
}

class ComponentWithBothPropsAndContextAccess extends React.Component {
  static contextTypes = {
    name: React.PropTypes.string,
  };

  // we actually don't need a constructor here since this will be
  // initialized after a proper super(props, context) call.
  // in other words, `this` will be ready when it reaches here.
  state = {
    foo: this.props.foo,
    bar: this.context.bar,
  };

  render() {
    return (
      <div>{this.context.name}</div>
    );
  }
}

class App extends React.Component {
  state: SomeState;

  constructor(props, context) {
    super(props, context);
    const state = this.calculateState(); // _might_ use `this.context`
    this.state = state;
  }

  calculateState = () => {
    return { color: this.context.color };
  };

  render() {
    return <div />;
  }
}

class App2 extends React.Component {
  state: *;

  constructor(props, context) {
    super(props, context);
    const state = {
      whatever: context.whatever, // needs context
    };
    this.state = state;
  }

  render() {
    return <div />;
  }
}

App.contextTypes = {
  whatever: React.PropTypes.object,
};

class MyComponent2 extends React.Component {
  state: *;

  constructor(props) {
    super(props);
    var x = props.foo.bar.wow.so.deep;

    this.state = {
      heyoo: 23,
    };
  }

  foo = (): void => {
    this.setState({heyoo: 24});
  };
}

const getContextFromInstance = (x) => x.context; // meh

class MyComponent3 extends React.Component {
  state: *;

  constructor(props, context) {
    super(props, context);
    var x = getContextFromInstance(this); // `this` is referenced alone

    this.state = {
      heyoo: x,
    };
  }

  foo = (): void => {
    this.setState({heyoo: 24});
  };
}

// we are not sure what you'll need from `this`,
// so it's safe to defer `state`'s initialization
class MyComponent4 extends React.Component {
  foo = (): void => {
    this.setState({heyoo: 24});
  };

  state = {
    heyoo: getContextFromInstance(this),
  };
}

// but only accessing `this.props` and/or `this.context` is safe
class MyComponent5 extends React.Component {
  state = {
    heyoo: getContextFromInstance(this.props),
  };

  foo = (): void => {
    this.setState({heyoo: 24});
  };
}

// intense control flow testing
class Loader extends React.Component {
  state: *;

  constructor(props, context) {
    super(props, context);
    if (props.stuff) {
      this.state = {x: 1};
      return;
    } else if (props.thing) {
      this.state = {x: 2};
      return;
    }
    switch (props.wow) {
      case 1:
        this.state = props.lol ?
          {x: 3} :
          this.whatever(props);

        return;
    }
    for (let i = 0; i < 100; i++) {
      if (i === 20) {
        this.state = {x: i};
        return;
      }
    }

    try {
      doSomeThingReallyBad();
    } catch (e) {
      this.state = {error: e};
      return;
    }

    this.state = this.lol();
  }

  render() {
    return null;
  }
}

class FunctionDeclarationInGetInitialState extends React.Component {
  state: *;

  constructor(props) {
    super(props);
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

    this.state = {
      x: func(),
      y: foo(),
      z: q(),
    };
  }

  render() {
    return null;
  }
}

class DeferStateInitialization extends React.Component {
  something = 42;
  state = {x: this.something};

  render() {
    return <div onClick={this.reset} />;
  }
}

var helper = () => {};

// fallback
var PassGetInitialState = createReactClass({
  displayName: 'PassGetInitialState',

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
var UseGetInitialState = createReactClass({
  displayName: 'UseGetInitialState',

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
var UseArguments = createReactClass({
  displayName: 'UseArguments',

  helper() {
    console.log(arguments);
  },

  render() {
    return null;
  },
});

// fallback
var ShadowingIssue = createReactClass({
  displayName: 'ShadowingIssue',

  getInitialState() {
    const props = { x: 123 };
    return { x: props.x };
  },

  render() {
    return null;
  },
});

// will remove unnecessary bindings
class ShadowingButFine extends React.Component {
  state: *;

  constructor(props, context) {
    super(props, context);
    this.state = { x: props.x + context.x };
  }

  render() {
    return null;
  }
}

// move type annotations
class WithSimpleType extends React.Component {
  state: Object = {
    x: 12,
    y: 13,
    z: 14,
  };

  render() {
    return null;
  }
}

class WithLongType extends React.Component {
  state: {name: string, age: number, counter: number} = {
    name: 'Michael',
    age: 23,
    count: 6,
  };

  render() {
    return null;
  }
}

class WithMultiLineType extends React.Component {
  state: {
    nameLists: Array<Array<string>>,
    age?: ?number,
    counter?: ?number,
  } = {
    nameLists: [['James']],
    count: 1400,
    foo: 'bar',
  };

  render() {
    return null;
  }
}

class WithArrowFunction extends React.Component {
  state: {heyoo: number} = {
    heyoo: 23,
  };

  render() {
    return null;
  }
}

class WithArrowFunctionAndObject extends React.Component {
  state: {heyoo: number} = {
    heyoo: 23,
  };

  render() {
    return null;
  }
}
