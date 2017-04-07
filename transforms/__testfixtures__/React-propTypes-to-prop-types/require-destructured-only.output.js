const React = require('react');
const PropTypes = require('prop-types');

class ClassComponent extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
  };
  render() {
    return <div>{this.props.text}</div>;
  }
}

function FunctionalComponent (props) {
  return <div>{props.text}</div>;
}
FunctionalComponent.propTypes = {
  text: PropTypes.string.isRequired,
};