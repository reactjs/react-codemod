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

var TESTS = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
];

TESTS.forEach(test => {
  defineTest(
    __dirname,
    'manual-bind-to-arrow',
    {flow: true},
    'manual-bind-to-arrow/manual-bind-to-arrow' + test
  );
});
