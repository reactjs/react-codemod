'use strict';

var React = require('React');
var Relay = require('Relay');

var Image = require('Image.react');

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

// Class comment
var MyComponent2 = React.createClass({
  getDefaultProps: function() {
    return {a: 1};
  },
  foo: function() { // flow annotations dont work for now
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

  _renderText: function(text: string) { // TODO no return type yet
    return <Text text={text} />;
  },

  _renderImageRange: function(text: string, range) { // TODO no return type yet
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
  },

  autobindMe: function() {},
  dontAutobindMe: function(): number { return 12; },

  // Function comment
  _renderRange: function(text: string, range, bla: Promise<string>) {
    var self = this;

    self.dontAutobindMe();
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
