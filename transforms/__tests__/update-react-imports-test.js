/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

const tests = [
  'default-and-multiple-specifiers-import-react-variable',
  'default-and-multiple-specifiers-import',
  'flow-default-and-type-specifier-import-react-variable',
  'flow-default-and-type-specifier-import',
  'jsx-element',
  'jsx-fragment',
  'react-basic-default-export-jsx-element-react-variable',
  'react-basic-default-export-jsx-element',
  'react-basic-default-export',
  'react-type-default-export',
];

jest.mock('../update-react-imports', () => {
  return Object.assign(require.requireActual('../update-react-imports'), {
    parser: 'flow',
  });
});

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

tests.forEach((test) => {
  defineTest(
    __dirname,
    'update-react-imports',
    null,
    `update-react-imports/${test}`
  );
});
