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
const ReactComponentWithPureRenderMixin = require('ReactComponentWithPureRenderMixin');

/**
 * just a description here
 */
const HelloGuys = React.createClass({
  mixins: [
    ReactComponentWithPureRenderMixin,
  ],

  propTypes: {},

  render(): ReactElement<any> {
    return (
      <div>
        wassup
      </div>
    );
  },
});

module.exports = HelloGuys;
