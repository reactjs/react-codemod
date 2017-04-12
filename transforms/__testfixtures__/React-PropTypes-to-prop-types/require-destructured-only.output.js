const Abc = require('abc');
const PropTypes = require('prop-types');
const React = require('react');
const Xyz = require('xyz');

class ClassComponent extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
  };
  render() {
    return <Abc>{this.props.text}</Abc>;
  }
}

function FunctionalComponent (props) {
  return <Xyz>{props.text}</Xyz>;
}
FunctionalComponent.propTypes = {
  text: PropTypes.string.isRequired,
};