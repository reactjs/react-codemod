'use strict';

import {PropTypes} from 'React';

import ReactCreateClass from 'react-create-class';

const SomeMixin = {
  componentDidMount() {
    console.log('did mount');
  },
};

export default ReactCreateClass({
  mixins: [SomeMixin],
  propTypes: {
    foo: PropTypes.string,
  },
  render: function() {
    return null;
  },
});
