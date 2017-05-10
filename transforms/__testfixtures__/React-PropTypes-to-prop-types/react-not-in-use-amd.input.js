define(['jquery', 'react', 'lodash'], function($, React, _) {
  'use strict';

  var propTypes = {text: React.PropTypes.string.isRequired};

  function FunctionalComponent (props) {
    return <div>{props.text}</div>;
  }

  FunctionalComponent.propTypes = {
    text: React.PropTypes.string.isRequired,
  };

  return classComponent;
});
