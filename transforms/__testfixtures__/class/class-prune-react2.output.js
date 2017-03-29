'use strict';

import React from 'React';

import ReactCreateClass from 'react-create-class';

const SomeMixin = {
  componentDidMount() {
    console.log('did mount');
  },
};

export default ReactCreateClass({
  mixins: [SomeMixin],
  render: function() {
    return <div />;
  },
});
