/**
 * Copyright 2004-present Facebook. All rights reserved.
 *
 * @providesModule HelloGuys
 * @fbt {"foo": "bar"}
 * @flow
 * @typechecks
 */

'use strict';

const React = require('React');

/**
 * just a description here
 */
class HelloGuys extends React.PureComponent {
  props: {};
  static propTypes = {};

  render(): ReactElement<any> {
    return (
      <div>
        wassup
      </div>
    );
  }
}

module.exports = HelloGuys;
