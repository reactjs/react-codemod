'use strict';

var React = require('React');
var Relay = require('Relay');

var Image = require('Image.react');

// Class comment
var MyComponent2 = React.createClass({
  getDefaultProps: function(): Object {
    return {a: 1};
  },
  foo: function(): void {
    const x = (a: Object, b: string): void => {}; // This code cannot be parsed by Babel v5
    pass(this.foo);
    this.forceUpdate();
  },
});

var MyComponent3 = React.createClass({
  statics: {
    someThing: 10,
    funcThatDoesNothing: function(): void {},
  },
  propTypes: {
    highlightEntities: React.PropTypes.bool,
    linkifyEntities: React.PropTypes.bool,
    text: React.PropTypes.shape({
      text: React.PropTypes.string,
      ranges: React.PropTypes.array,
    }).isRequired,
  },

  getDefaultProps: function() {
    unboundFunc();
    return {
      linkifyEntities: true,
      highlightEntities: false,
    };
  },

  getInitialState: function() {
    this.props.foo();
    return {
      heyoo: 23,
    };
  },

  // comment here
  _renderText: function(text: string): ReactElement<any> { // say something
    return <Text text={text} />;
  },

  _renderImageRange: function(text: string, range): ReactElement<any> {
    var image = range.image;
    if (image) {
      return (
        <Image
          src={image.uri}
          height={image.height / image.scale}
          width={image.width / image.scale}
        />
      );
    }
    return null;
  },

  autobindMe: function() {},
  okBindMe: function(): number { return 12; },

  // Function comment
  _renderRange: function(text: string, range, bla: Promise<string>): ReactElement<any> {
    var self = this;

    self.okBindMe();
    call(self.autobindMe);

    var type = rage.type;
    var {highlightEntities} = this.props;

    if (type === 'ImageAtRange') {
      return this._renderImageRange(text, range);
    }

    if (this.props.linkifyEntities) {
      text =
        <Link href={usersURI}>
          {text}
        </Link>;
    } else {
      text = <span>{text}</span>;
    }

    return text;
  },

  /* This is a comment */
  render: function() {
    var content = this.props.text;
    return (
      <BaseText
        {...this.props}
        textRenderer={this._renderText}
        rangeRenderer={this._renderRange}
        text={content.text}
      />
    );
  },
});

var MyComponent4 = React.createClass({
  foo: callMeMaybe(),
  render: function() {},
});

module.exports = Relay.createContainer(MyComponent, {
  queries: {
    me: Relay.graphql`this is not graphql`,
  },
});

var MyComponent5 = React.createClass({
  getDefaultProps: function() {
    return {
      thisIs: true,
      andThisIs: false,
    };
  },

  statics: {},

  getInitialState: function() {
    return {
      todos: [],
    };
  },

  renderTodo: function(): ReactElement<any> {
    return (
      <div>
        {this.state.todos.map((item) => <p key={item.id}>{item.text}</p>)}
      </div>
    );
  },

  render: function() {
    return (
      <div>
        <h1>TODOs</h1>
        {this.renderTodo()}
      </div>
    );
  },
});

var GoodName = React.createClass({
  displayName: 'GoodName',
  render() {
    return <div/>;
  },
});

var SingleArgArrowFunction = React.createClass({
  formatInt: function(/*number*/ num) /*string*/ {
    return 'foobar';
  },
  render() {
    return <div/>;
  },
});

var mySpec = {};
var NotAnObjectLiteral = React.createClass(mySpec);

var WaitWhat = React.createClass();

var HasSpreadArgs = React.createClass({
  _helper: function(...args) {
    return args;
  },
  _helper2: function(a, b, c, ...args) {
    return args.concat(a);
  },
  _helper3: function(a: number, ...args: Array<string>) {
    return args.concat('' + a);
  },
  render() {
    return <div/>;
  },
});

var HasDefaultArgs = React.createClass({
  _helper: function(foo = 12) {
    return foo;
  },
  _helper2: function({foo: number = 12, abc}, bar: string = 'hey', ...args: Array<string>) {
    return args.concat(foo, bar);
  },
  render() {
    return <div/>;
  },
});

var ManyArgs = React.createClass({
  _helper: function(foo = 12) {
    return foo;
  },
  _helper2: function({foo: number = 12, abc}, bar: string = 'hey', x: number, y: number, ...args: Array<string>) {
    return args.concat(foo, bar);
  },
  render() {
    return <div/>;
  },
});
