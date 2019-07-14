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
  'already-migrated-import',
  'already-migrated-require',
  'assigned-from-react-var',
  'assigned-to-var-with-different-name',
  'default-and-named-import',
  'default-import',
  'destructured-proptypes-import',
  'import-alias',
  'import-flow-type-with-require',
  'mixed-import-and-require',
  'mixed-import-and-require-2',
  'named-parameters',
  'nested-destructured-proptypes-import',
  'no-change-import',
  'no-change-require',
  'require-alias',
  'require-destructured-multi',
  'require-destructured-only',
  'require-destructured-direct',
  'require',
  'with-top-comment',
];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;
const testOptions = { parser: 'flow' };

describe('React-PropTypes-to-prop-types', () => {
  tests.forEach(test =>
    defineTest(
      __dirname,
      'React-PropTypes-to-prop-types',
      null,
      `React-PropTypes-to-prop-types/${ test }`,
      testOptions
    )
  );

  defineTest(
    __dirname,
    'React-PropTypes-to-prop-types',
    { 'module-name': 'PropTypes' },
    'React-PropTypes-to-prop-types/module-name',
    testOptions
  );
});
