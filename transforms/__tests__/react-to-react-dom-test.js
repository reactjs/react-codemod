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
  'require-dom-base',
  'require-server-base',
  'require-keeps-react',
  'require-indirect',
  'import-dom-base',
  'import-server-base',
  'import-multiple-specifiers',
  'mixed-with-existing-react-dom',
  'import-with-existing-react-dom',
  'import-without-default-specifier',
];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;
describe('react-to-react-dom', () => {
  tests.forEach(test =>
    defineTest(
      __dirname,
      'react-to-react-dom',
      null,
      `react-to-react-dom/${ test }`
    )
  )
});
