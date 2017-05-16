define(['create-react-class', 'jquery', 'react', 'lodash'], function(createReactClass, $, React, _) {
  'use strict';

  var classComponent = createReactClass({
    displayName: 'DummyClass',
    mixins: [someMixin],
    propTypes: {
      text: React.PropTypes.string.isRequired,
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
