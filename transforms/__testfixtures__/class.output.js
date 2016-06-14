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

  foo = (): void => {
    pass(this.foo);
    this.forceUpdate();
  };
}

class MyComponent3 extends React.Component {
  static propTypes = {
    highlightEntities: React.PropTypes.bool,
    linkifyEntities: React.PropTypes.bool,
    text: React.PropTypes.shape({
      text: React.PropTypes.string,
      ranges: React.PropTypes.array,
    }).isRequired,
  };

  static defaultProps = function() {
    unboundFunc();
    return {
      linkifyEntities: true,
      highlightEntities: false,
    };
  }();

  static someThing = 10;
  static funcThatDoesNothing = function(): void {};

  constructor(props, context) {
    super(props, context);
    props.foo();

    this.state = {
      heyoo: 23,
    };
  }

  // comment here
  _renderText = (text: string): ReactElement<any> => { // say something
    return <Text text={text} />;
  };

  autobindMe = () => {};

  // Function comment
  _renderRange = (text: string, range, bla: Promise<string>): ReactElement<any> => {
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

  _renderImageRange(text: string, range): ReactElement<any> {
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
