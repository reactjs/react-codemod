import Abc from 'abc';
import PropTypes from 'prop-types';
import React from 'React';
import Xzy from 'xyz';

class ClassComponent extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
  };
  render() {
    return <Abc>{this.props.text}</Abc>;
  }
}

function FunctionalComponent (props) {
  return <Xzy>{props.text}</Xzy>;
}
FunctionalComponent.propTypes = {
  text: PropTypes.string.isRequired,
};