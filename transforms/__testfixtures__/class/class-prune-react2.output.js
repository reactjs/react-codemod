'use strict';

import React from 'React';

import createReactClass from 'create-react-class';

const SomeMixin = {
  componentDidMount() {
    console.log('did mount');
  },
};

export default createReactClass({
  displayName: 'class-prune-react2.input',
  mixins: [SomeMixin],

  render: function() {
    return <div />;
  },
});
