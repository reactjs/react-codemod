/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree. 
 *
 */

'use strict';

jest.mock('../ReactNative-View-propTypes', () => {
  return Object.assign(require.requireActual('../ReactNative-View-propTypes'), {
    parser: 'flow'
  });
});

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
