'use strict';

var React = require('React');
var Relay = require('Relay');

var Image = require('Image.react');

/*
 * Multiline
 */
class MyComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    var x = props.foo;

    this.state = {
      heyoo: 23,
    };
  }

  foo(): void {
    this.setState({heyoo: 24});
  }
}

// Class comment
class MyComponent2 extends React.Component {
  static defaultProps = {a: 1};

  foo = () => { // flow annotations dont work for now
    pass(this.foo);
    this.forceUpdate();
  };
}

class MyComponent3 extends React.Component {
  static defaultProps = function() {
    unboundFunc();
    return {
      linkifyEntities: true,
      highlightEntities: false,
    };
  }();

  static funcThatDoesNothing = function(): void {};

  static propTypes = {
    highlightEntities: React.PropTypes.bool,
    linkifyEntities: React.PropTypes.bool,
    text: React.PropTypes.shape({
      text: React.PropTypes.string,
      ranges: React.PropTypes.array,
    }).isRequired,
  };

  static someThing = 10;

  constructor(props, context) {
    super(props, context);
    props.foo();

    this.state = {
      heyoo: 23,
    };
  }

  // Function comment
  _renderRange = (text: string, range, bla: Promise<string>) => {
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
  };

  _renderText = (text: string) => { // TODO no return type yet
    return <Text text={text} />;
  };

  autobindMe = () => {};

  _renderImageRange(text: string, range) { // TODO no return type yet
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
  }

  dontAutobindMe(): number { return 12; }

  /* This is a comment */
  render() {
    var content = this.props.text;
    return (
      <BaseText
        {...this.props}
        textRenderer={this._renderText}
        rangeRenderer={this._renderRange}
        text={content.text}
      />
    );
  }
}

var MyComponent4 = React.createClass({
  foo: callMeMaybe(),
  render: function() {},
});

module.exports = Relay.createContainer(MyComponent, {
  queries: {
    me: Relay.graphql`this is not graphql`,
  },
});
