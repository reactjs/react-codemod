define(['prop-types', 'jquery', 'lodash'], function(PropTypes, $, _) {
  'use strict';

  var propTypes = {text: PropTypes.string.isRequired};

  function FunctionalComponent (props) {
    return <div>{props.text}</div>;
  }

  FunctionalComponent.propTypes = {
    text: PropTypes.string.isRequired,
  };

  return classComponent;
});
