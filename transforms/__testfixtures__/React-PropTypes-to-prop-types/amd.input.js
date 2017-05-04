define(['jquery', 'react', 'lodash'], function($, React, _) {
  'use strict';

  var classComponent = class ClassComponent extends React.Component {
    static propTypes = {
      text: React.PropTypes.string.isRequired,
    };
    render() {
      return <div>{this.props.text}</div>;
    }
  }

  function FunctionalComponent (props) {
    return <div>{props.text}</div>;
  }

  FunctionalComponent.propTypes = {
    text: React.PropTypes.string.isRequired,
  };

  return classComponent;
});
