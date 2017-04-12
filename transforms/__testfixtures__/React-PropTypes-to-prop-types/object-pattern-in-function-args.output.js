import React from 'react';

import PropTypes from 'prop-types';

function FunctionalComponent({text}) {
  return <div>{text}</div>;
}

FunctionalComponent.propTypes = {
  text: PropTypes.string.isRequired,
};
