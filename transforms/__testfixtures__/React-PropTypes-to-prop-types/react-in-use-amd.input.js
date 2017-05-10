define(['jquery', 'react', 'lodash'], function($, React, _) {
  'use strict';

  var propTypes = {
      dummy: React.dummy,
      text: React.PropTypes.string.isRequired,
    };

  function FunctionalComponent (props) {
    var dummy = React.getDummy();
    return <div>{props.text}</div>;
  }

  FunctionalComponent.propTypes = {
    text: React.PropTypes.string.isRequired,
  };

  return classComponent;
});
