'use strict';

import React from 'React';

const SomeMixin = {
  componentDidMount() {
    console.log('did mount');
  },
};

export default React.createClass({
  mixins: [SomeMixin],
  render: function() {
    return null;
  },
});
