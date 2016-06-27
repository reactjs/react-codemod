/* @flow */

var React = require('react');

const justNeedKeys = {
  a: 12,
  b: 23,
};

var Component = React.createClass({
  propTypes: {
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
  },

  render: function() {
    return (
      <div>type safety</div>
    );
  },
});
