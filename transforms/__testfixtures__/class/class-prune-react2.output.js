'use strict';

import React from 'React';

import createReactClass from 'react-create-class';

const SomeMixin = {
  componentDidMount() {
    console.log('did mount');
  },
};

export default createReactClass({
  mixins: [SomeMixin],
  render: function() {
    return <div />;
  },
});
