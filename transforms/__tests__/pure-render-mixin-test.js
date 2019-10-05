/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree. 
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
