define([
  'jquery',
  'react',
  'dummy',
  'lodash',
  'prop-types'
],
  function(
    $,
    React,
    dummy,
    _,
    PropTypes
  ) {
    'use strict';

    return React.createClass({
      displayName: 'dummyReactClass',
      mixins: [dummy.mixins.dummyMixin],
      propTypes: {
        dummyBool: PropTypes.bool,
        dummyString: PropTypes.string.isRequired,
        dummyString2: PropTypes.string.isRequired,
        dummyNumber: PropTypes.number,
        dummyFunc: PropTypes.func
      },
      render: function(props) {
        return React.createElement('div', {}, React.createElement('span', {}));
      }
    });
  });
