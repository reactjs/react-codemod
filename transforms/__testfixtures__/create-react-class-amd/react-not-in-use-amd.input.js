define(['jquery', 'react', 'lodash', 'prop-types'], function($, React, _, PropTypes) {
  'use strict';

  var classComponent = React.createClass({
    displayName: 'DummyClass',
    mixins: [someMixin],
    propTypes: {
      text: PropTypes.string.isRequired,
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
