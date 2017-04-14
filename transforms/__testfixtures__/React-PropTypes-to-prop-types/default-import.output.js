import Abc from 'abc';
import PropTypes from 'prop-types';
import React from 'React';
import Xzy from 'xyz';

class ClassComponent extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
  };
  render() {
    const { text, ...rest } = this.props;
    return <Abc>{text}</Abc>;
  }
}

function FunctionalComponent (props) {
    const { text, ...rest } = props;
    return <Xzy>{text}</Xzy>;
}
FunctionalComponent.propTypes = {
  text: PropTypes.string.isRequired,
};