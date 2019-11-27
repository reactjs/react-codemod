/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

jest.mock('../manual-bind-to-arrow', () => {
  return Object.assign(require.requireActual('../manual-bind-to-arrow'), {
    parser: 'flow'
  });
});

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
  9,
  10,
  11
];

TESTS.forEach(test => {
  defineTest(
    __dirname,
    'manual-bind-to-arrow',
    {flow: true},
    'manual-bind-to-arrow/manual-bind-to-arrow' + test
  );
});
