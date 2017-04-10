import React, { PropTypes } from 'react';

function FunctionalComponent({text}) {
  return <div>{text}</div>;
}

FunctionalComponent.propTypes = {
  text: PropTypes.string.isRequired,
};
