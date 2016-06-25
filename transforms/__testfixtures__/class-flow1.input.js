/* @flow */

var React = require('react');

var Component = React.createClass({
  propTypes: {
    optionalArray: React.PropTypes.array,
    optionalBool: React.PropTypes.bool,
    optionalFunc: React.PropTypes.func,
    optionalNumber: React.PropTypes.number,
    optionalObject: React.PropTypes.object,
    optionalString: React.PropTypes.string,
    optionalNode: React.PropTypes.node,
    optionalElement: React.PropTypes.element,
    optionalMessage: React.PropTypes.instanceOf(Message),
    optionalEnum: React.PropTypes.oneOf(['News', 'Photos', 1, true, null]),
    optionalUnion: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.instanceOf(Message),
    ]),
    optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),
    optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),
    optionalObjectOfNonOptionalField: React.PropTypes.objectOf(React.PropTypes.number.isRequired),
    objectOfNonOptionalField: React.PropTypes.objectOf(React.PropTypes.number.isRequired).isRequired,
    objectOfOptionalField: React.PropTypes.objectOf(React.PropTypes.number).isRequired,
    optionalObjectWithShape: React.PropTypes.shape({
      color: React.PropTypes.string,
      fontSize: React.PropTypes.number.isRequired,
    }),
    requiredFunc: React.PropTypes.func.isRequired,
    requiredAny: React.PropTypes.any.isRequired,
  },

  render: function() {
    return (
      <div>type safety</div>
    );
  },
});
