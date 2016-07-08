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

class Component extends React.Component {
  static propTypes = Object.assign({}, {
    ...spreadMe,
    optionalFuncShortHand,
    optionalNumber: PropTypes.number,
    optionalObject: PropTypes.object,
  });

  render() {
    return (
      <div>type safety</div>
    );
  }
}

var thatPropTypes = {};

class Component2 extends React.Component {
  static propTypes = thatPropTypes;

  render() {
    return (
      <div>type safety</div>
    );
  }
}
