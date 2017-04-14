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
  'default-and-named-import',
  'default-import',
  'destructured-proptypes-import',
  'mixed-import-and-require',
  'named-parameters',
  'no-change-import',
  'no-change-require',
  'require-destructured-multi',
  'require-destructured-only',
  'require',
];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('React-PropTypes-to-prop-types', () => {
  tests.forEach(test =>
    defineTest(
      __dirname,
      'React-PropTypes-to-prop-types',
      null,
      `React-PropTypes-to-prop-types/${ test }`
    )
  );
});
