/* @flow */

var React = require('react');
var {PropTypes} = React;

var myUnionPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.instanceOf(Message),
]);

var spreadMe = {
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
};

var optionalFuncShortHand = PropTypes.func;

var Component = React.createClass({
  propTypes: Object.assign({}, {
    ...spreadMe,
    optionalFuncShortHand,
    optionalNumber: PropTypes.number,
    optionalObject: PropTypes.object,
  }),

  render: function() {
    return (
      <div>type safety</div>
    );
  },
});

var thatPropTypes = {};

var Component2 = React.createClass({
  propTypes: thatPropTypes,

  render: function() {
    return (
      <div>type safety</div>
    );
  },
});
