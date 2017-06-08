'use strict';

import React, {PropTypes} from 'React';

import createReactClass from 'create-react-class';

const SomeMixin = {
  componentDidMount() {
    console.log('did mount');
  },
};

export default createReactClass({
  displayName: 'class-prune-react4.input',
  mixins: [SomeMixin],

  propTypes: {
    foo: PropTypes.string,
  },

  render: function() {
    return <div />;
  },
});
