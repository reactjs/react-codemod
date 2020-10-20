/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

const flowOnlyTests = [
  'flow-default-and-type-specifier-import-react-variable',
  'flow-default-and-type-specifier-import',
  'react-type-not-removed',
  'react-type-default-export',
];

const tsOnlyTests = [
  'preserve-types-namespace',
  'preserve-types-default',
];

const tests = [
  'default-and-multiple-specifiers-import-react-variable',
  'default-and-multiple-specifiers-import',
  'jsx-element',
  'jsx-fragment',
  'leading-comment',
  'react-basic-default-export-jsx-element-react-variable',
  'react-basic-default-export-jsx-element',
  'react-basic-default-export',
  'react-not-removed',
  'variable-already-used',
  'react-jsx-member-expression',
  'react-already-used-named-export',
];

const destructureNamedImportTests = [
  'destructure-named-imports',
  'destructure-named-imports-variable-used',
  'destructure-named-imports-react-not-removed',
];

jest.mock('../update-react-imports', () => {
  return Object.assign(require.requireActual('../update-react-imports'), {
    parser: 'flow',
  });
});

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

[...tests, ...flowOnlyTests].forEach((test) => {
  defineTest(
    __dirname,
    'update-react-imports',
    null,
    `update-react-imports/${test}`
  );
});

describe('typescript', () => {
  beforeEach(() => {
    jest.mock('../update-react-imports', () => {
      return Object.assign(
        require.requireActual('../update-react-imports'),
        {
          parser: 'tsx'
        }
      );
    });
  });

  afterEach(() => {
    jest.resetModules();
  });

  [...tests, ...tsOnlyTests].forEach((test) => {
    defineTest(
      __dirname,
      'update-react-imports',
      null,
      `update-react-imports/typescript/${test}.tsx`
    );
  });
});

destructureNamedImportTests.forEach((test) => {
  defineTest(
    __dirname,
    'update-react-imports',
    {destructureNamespaceImports: true},
    `update-react-imports/${test}`
  );
});
