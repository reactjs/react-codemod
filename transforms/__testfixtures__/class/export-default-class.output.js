/*eslint-disable no-extra-semi*/

'use strict';

import React from 'React';

export default class extends React.Component {
  static propTypes = {
    foo: React.PropTypes.string,
  };

  state = {
    foo: 'bar',
  };

  render() {
    return <div />;
  }
}
