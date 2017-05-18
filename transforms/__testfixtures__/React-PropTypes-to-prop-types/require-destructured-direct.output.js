const PropTypes = require('prop-types');
const React = require('react');

function Foo(props) {
  return <div>{props.text}</div>;
}
Foo.propTypes = {
  text: PropTypes.string.isRequired,
};
