/* @flow */

var React = require('react');

const justNeedKeys = {
  a: 12,
  b: 23,
};

class Component extends React.Component {
  props: {
    optionalMessage?: Message,
    optionalMessageOops?: $FlowFixMe,
    optionalEnum?: $FlowFixMe,
    optionalEnumOops?: $FlowFixMe,
    optionalUnion?: string | number | Message,
    optionalUnionOops?: $FlowFixMe,
    optionalUnionOops2?: $FlowFixMe,
    optionalArrayOf?: Array<number>,
    optionalObjectOf?: {[key: string]: number},
    optionalObjectWithShape?: {
      color?: string,
      fontSize?: $FlowFixMe,
      name?: $FlowFixMe,
    },
    optionalObjectWithShapeOops?: $FlowFixMe,
    optionalObjectWithShapeOops2?: $FlowFixMe,
    'is-literal-cool'?: boolean,
    'well-fine': number,
  };

  static propTypes = {
    optionalMessage: React.PropTypes.instanceOf(Message),
    optionalMessageOops: React.PropTypes.instanceOf(foo()),
    optionalEnum: React.PropTypes.oneOf(Object.keys(justNeedKeys)),
    optionalEnumOops: React.PropTypes.oneOf(bar),
    optionalUnion: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.instanceOf(Message),
    ]),
    optionalUnionOops: React.PropTypes.oneOfType(foo()),
    optionalUnionOops2: React.PropTypes.oneOfType(Bar),
    optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),
    optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),
    optionalObjectWithShape: React.PropTypes.shape({
      color: React.PropTypes.string,
      fontSize: foo,
      name: bla(),
    }),
    optionalObjectWithShapeOops: React.PropTypes.shape(foo()),
    optionalObjectWithShapeOops2: React.PropTypes.shape(bla),
    'is-literal-cool': React.PropTypes.bool,
    'well-fine': React.PropTypes.number.isRequired,
  };

  render() {
    return (
      <div>type safety</div>
    );
  }
}
