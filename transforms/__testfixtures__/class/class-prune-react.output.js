'use strict';

import createReactClass from 'react-create-class';

const SomeMixin = {
  componentDidMount() {
    console.log('did mount');
  },
};

export default createReactClass({
  mixins: [SomeMixin],
  render: function() {
    return null;
  },
});
