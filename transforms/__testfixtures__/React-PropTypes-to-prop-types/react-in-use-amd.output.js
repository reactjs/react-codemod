define(['prop-types', 'jquery', 'react', 'lodash'], function(PropTypes, $, React, _) {
  'use strict';

  var propTypes = {
      dummy: React.dummy,
      text: PropTypes.string.isRequired,
    };

  function FunctionalComponent (props) {
    var dummy = React.getDummy();
    return <div>{props.text}</div>;
  }

  FunctionalComponent.propTypes = {
    text: PropTypes.string.isRequired,
  };

  return classComponent;
});
