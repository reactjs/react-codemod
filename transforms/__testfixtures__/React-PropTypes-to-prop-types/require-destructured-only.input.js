const Abc = require('abc');
const React = require('react');
const { PropTypes } = React;
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