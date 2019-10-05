/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree. 
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
  );
});
