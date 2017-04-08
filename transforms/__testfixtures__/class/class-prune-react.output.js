'use strict';

import createReactClass from 'create-react-class';

const SomeMixin = {
  componentDidMount() {
    console.log('did mount');
  },
};

export default createReactClass({
  displayName: 'class-prune-react.input',
  mixins: [SomeMixin],

  render: function() {
    return null;
  },
});
