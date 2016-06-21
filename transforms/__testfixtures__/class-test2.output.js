'use strict';

var React = require('React');
var ReactComponentWithPureRenderMixin = require('ReactComponentWithPureRenderMixin');
var FooBarMixin = require('FooBarMixin');

class ComponentWithNonSimpleInitialState extends React.Component {
  static iDontKnowWhyYouNeedThis = true; // but comment it
  static foo = 'bar';

  static dontBindMe(count: number): any {
    return this;
  }

  constructor(props) {
    super(props);

    this.state = {
      counter: props.initialNumber + 1,
    };
  }

  render() {
    return (
      <div>{this.state.counter}</div>
    );
  }
}

class ComponentWithBothPropsAndContextAccess extends React.Component {
  static contextTypes = {
    name: React.PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      foo: props.foo,
    };
  }

  render() {
    return (
      <div>{this.context.name}</div>
    );
  }
}

// Comment
module.exports = class extends React.Component {
  static propTypes = {
    foo: React.PropTypes.bool,
  };

  static defaultProps = {
    foo: 12,
  };

  constructor() {
    super();
    // non-simple getInitialState
    var data = 'bar';

    this.state = {
      bar: data,
    };
  }

  render() {
    return <div />;
  }
};

var ComponentWithInconvertibleMixins = React.createClass({
  mixins: [ReactComponentWithPureRenderMixin, FooBarMixin],

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

// taken from https://facebook.github.io/react/docs/context.html#updating-context
class MediaQuery extends React.Component {
  static childContextTypes = {
    type: React.PropTypes.string,
  };

  state = {type:'desktop'};

  getChildContext() {
    return {type: this.state.type};
  }

  componentDidMount() {
    const checkMediaQuery = () => {
      const type = window.matchMedia('(min-width: 1025px)').matches ? 'desktop' : 'mobile';
      if (type !== this.state.type) {
        this.setState({type});
      }
    };

    window.addEventListener('resize', checkMediaQuery);
    checkMediaQuery();
  }

  render() {
    return this.props.children;
  }
}
