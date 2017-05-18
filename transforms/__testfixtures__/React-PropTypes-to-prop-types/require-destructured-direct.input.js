const React = require('react');
const { PropTypes } = require('react');

function Foo(props) {
  return <div>{props.text}</div>;
}
Foo.propTypes = {
  text: PropTypes.string.isRequired,
};
