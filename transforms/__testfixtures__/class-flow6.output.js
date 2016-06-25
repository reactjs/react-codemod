/* @flow */

var React = require('react');

const justNeedKeys = {
  a: 12,
  b: 23,
};

class Component extends React.Component {
  props: {
    optionalMessage?: ?Message,
    optionalMessageOops?: any,
    optionalEnum?: any,
    optionalEnumOops?: any,
    optionalUnion?: ?(string | number | Message),
    optionalUnionOops?: any,
    optionalUnionOops2?: any,
    optionalArrayOf?: ?Array<number>,
    optionalObjectOf?: ?{[key: string]: ?number,},
    optionalObjectWithShape?: ?{
      color?: ?string,
      fontSize?: any,
      name?: any,
    },
    optionalObjectWithShapeOops?: any,
    optionalObjectWithShapeOops2?: any,
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
  };

  render() {
    return (
      <div>type safety</div>
    );
  }
}
