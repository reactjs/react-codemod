'use strict';

var React = require('React');
var createReactClass = require('create-react-class');
var ReactComponentWithPureRenderMixin = require('ReactComponentWithPureRenderMixin');
var FooBarMixin = require('FooBarMixin');

class ComponentWithNonSimpleInitialState extends React.Component {
  static iDontKnowWhyYouNeedThis = true; // but comment it
  static foo = 'bar';

  static dontBindMe(count: number): any {
    return this;
  }

  state = {
    counter: this.props.initialNumber + 1,
  };

  render() {
    return (
      <div>{this.state.counter}</div>
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

  constructor(props) {
    super(props);
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

var ComponentWithInconvertibleMixins = createReactClass({
  displayName: 'ComponentWithInconvertibleMixins',
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

var listOfInconvertibleMixins = [ReactComponentWithPureRenderMixin, FooBarMixin];

var ComponentWithInconvertibleMixins2 = createReactClass({
  displayName: 'ComponentWithInconvertibleMixins2',
  mixins: listOfInconvertibleMixins,

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
