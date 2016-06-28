/* @flow */

var React = require('react');
var {PropTypes} = React;

var getPropTypes = () => PropTypes.string;

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
  propTypes: {
    ...spreadMe,
    optionalFuncShortHand,
    optionalNumber: 1 + 1 === 2 ? PropTypes.number : PropTypes.string,
    optionalObject: PropTypes.object,
    optionalString: getPropTypes(),
    optionalNode: PropTypes.node,
    optionalElement: PropTypes.element,
    optionalMessage: PropTypes.instanceOf(Message),
    optionalEnum: PropTypes.oneOf(['News', 'Photos', 1, true, null]),
    optionalUnion: myUnionPropType,
    optionalArrayOf: PropTypes.arrayOf(PropTypes.number),
    optionalObjectOf: PropTypes.objectOf(PropTypes.number),
    optionalObjectWithShape: PropTypes.shape({
      color: PropTypes.string,
    }),
    requiredFunc: PropTypes.func.isRequired,
    requiredAny: PropTypes.any.isRequired,
  },

  render: function() {
    return (
      <div>type safety</div>
    );
  },
});
