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

const tests = [
  'component',
  'component-with-arrow-render',
  'component-with-defaultprops',
  'component-with-props',
  'component-with-render-consts'
];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;
describe('react-class-to-function', () => {
  tests.forEach(test =>
    defineTest(
      __dirname,
      'react-class-to-function',
      null,
      `react-class-to-function/${test}`
    )
  );
});
