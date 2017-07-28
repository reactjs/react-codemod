/**
 * This is some multiline comment
 */
import React, { PropTypes } from 'react';

function FunctionalComponent (props) {
  return <div>{props.text}</div>;
}
FunctionalComponent.propTypes = {
  text: PropTypes.string.isRequired,
};
