import Abc from 'abc';
import React from 'React';
import Xzy from 'xyz';

class ClassComponent extends React.Component {
  static propTypes = {
    text: React.PropTypes.string.isRequired,
  };
  render() {
    return <Abc>{this.props.text}</Abc>;
  }
}

function FunctionalComponent (props) {
  return <Xzy>{props.text}</Xzy>;
}
FunctionalComponent.propTypes = {
  text: React.PropTypes.string.isRequired,
};