'use strict';

import React, {PropTypes} from 'React';

const SomeMixin = {
  componentDidMount() {
    console.log('did mount');
  },
};

export default React.createClass({
  mixins: [SomeMixin],
  propTypes: {
    foo: PropTypes.string,
  },
  render: function() {
    return null;
  },
});
