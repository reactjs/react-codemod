import React from 'React';

/*
 * Multiline
 */
class MyComponent extends React.Component {
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

  // we actually _don't_ need a constructor here since this will be
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
  constructor(props, context) {
    super(props, context);
    const state = {
      whatever: this.context.whatever,
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
  constructor(props, context) {
    super(props, context);
    var x = getContextFromInstance(this);

    this.state = {
      heyoo: x,
    };
  }

  foo = (): void => {
    this.setState({heyoo: 24});
  };
}

class MyComponent4 extends React.Component {
  foo = (): void => {
    this.setState({heyoo: 24});
  };

  state = {
    heyoo: getContextFromInstance(this),
  };
}

class Loader extends React.Component {
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

    this.state = this.lol();
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

var UseArguments = React.createClass({
  helper() {
    console.log(arguments);
  },

  render() {
    return null;
  },
});

var ShadowingIssue = React.createClass({
  getInitialState() {
    const props = { x: 123 };
    return { x: props.x };
  },

  render() {
    return null;
  },
});

class ShadowingButFine extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { x: props.x + context.x };
  }

  render() {
    return null;
  }
}
