define(['create-react-class', 'jquery', 'lodash', 'prop-types'], function(createReactClass, $, _, PropTypes) {
  'use strict';

  var classComponent = createReactClass({
    displayName: 'DummyClass',
    mixins: [someMixin],
    propTypes: {
      text: PropTypes.string.isRequired,
    },
    render() {
      return <div>{this.props}</div>;
    }
  });

  return createReactClass({
    render() {
      return <div>{this.props.text}</div>;
    }
  });
});
