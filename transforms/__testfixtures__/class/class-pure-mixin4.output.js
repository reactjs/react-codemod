/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
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
