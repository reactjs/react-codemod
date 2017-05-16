define(['jquery', 'react', 'lodash'], function($, React, _) {
  'use strict';

  var classComponent = React.createClass({
    displayName: 'DummyClass',
    mixins: [someMixin],
    propTypes: {
      text: React.PropTypes.string.isRequired,
    },
    render() {
      return <div>{this.props}</div>;
    }
  });

  return React.createClass({
    render() {
      return <div>{this.props.text}</div>;
    }
  });
});
