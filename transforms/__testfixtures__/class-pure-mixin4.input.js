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
