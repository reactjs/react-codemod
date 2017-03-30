'use strict';

import {PropTypes} from 'React';

import createReactClass from 'react-create-class';

const SomeMixin = {
  componentDidMount() {
    console.log('did mount');
  },
};

export default createReactClass({
  mixins: [SomeMixin],
  propTypes: {
    foo: PropTypes.string,
  },
  render: function() {
    return null;
  },
});
