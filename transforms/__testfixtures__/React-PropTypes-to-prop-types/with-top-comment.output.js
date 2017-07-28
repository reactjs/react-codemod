/**
 * This is some multiline comment
 */
import PropTypes from 'prop-types';

import React from 'react';

function FunctionalComponent (props) {
  return <div>{props.text}</div>;
}
FunctionalComponent.propTypes = {
  text: PropTypes.string.isRequired,
};
