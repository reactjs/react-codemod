'use strict';

var React = require('React');

// Comment
module.exports = class extends React.Component {
  static propTypes = {
    foo: React.PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      foo: 'bar',
    };
  }

  render() {
    return <div />;
  }
};
