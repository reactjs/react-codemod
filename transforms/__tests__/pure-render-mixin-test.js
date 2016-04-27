/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

const defineTest = require('jscodeshift/dist/testUtils').defineTest;
defineTest(__dirname, 'pure-render-mixin');
defineTest(__dirname, 'pure-render-mixin', null, 'pure-render-mixin2');
defineTest(__dirname, 'pure-render-mixin', null, 'pure-render-mixin3');
defineTest(
  __dirname,
  'pure-render-mixin',
  {'mixin-name': 'ReactComponentWithPureRenderMixin'},
  'pure-render-mixin4'
);
