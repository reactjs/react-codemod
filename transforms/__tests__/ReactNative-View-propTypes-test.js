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
  'default-import-multi-reference',
  'default-import-only-reference',
  'default-require-multi-reference',
  'default-require-only-reference',
  'destructured-import-multi-reference',
  'destructured-import-only-reference',
  'destructured-require-multi-reference',
  'destructured-require-only-reference',
  'import-flow-type-with-require',
  'multiple-replacements',
  'noop-import',
  'noop-require',
];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('ReactNative-View-propTypes', () => {
  tests.forEach(test =>
    defineTest(
      __dirname,
      'ReactNative-View-propTypes',
      null,
      `ReactNative-View-propTypes/${ test }`
    )
  );
});
