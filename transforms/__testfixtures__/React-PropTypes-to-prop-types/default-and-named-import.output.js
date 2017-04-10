import React, { Component } from 'react';

import PropTypes from 'prop-types';

class ClassComponent extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
  };
  render() {
    const s = require('./ClassComponent.scss');
    return <div>{this.props.text}</div>;
  }
}

function FunctionalComponent (props) {
  return <div>{props.text}</div>;
}
FunctionalComponent.propTypes = {
  text: PropTypes.string.isRequired,
};
