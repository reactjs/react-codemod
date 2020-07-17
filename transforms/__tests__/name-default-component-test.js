/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const tests = [
  'function-component',
  'function-component-2',
  'function-component-ignore',
  'function-expression',
  'function-expression-ignore',
  'existing-name',
  'existing-name-ignore',
  '1-starts-with-number',
  'special-ch@racter',
  'typescript/function-expression', // Also works for Flow
];

describe('name-default-component', () => {
  describe('flow', () => {
    beforeEach(() => {
      jest.mock('../name-default-component', () => {
        return Object.assign(
          require.requireActual('../name-default-component'),
          {
            parser: 'flow',
          }
        );
      });
    });

    afterEach(() => {
      jest.resetModules();
    });

    tests.forEach((test) =>
      defineTest(
        __dirname,
        'name-default-component',
        null,
        `name-default-component/${test}`
      )
    );
  });

  describe('typescript', () => {
    beforeEach(() => {
      jest.mock('../name-default-component', () => {
        return Object.assign(
          require.requireActual('../name-default-component'),
          {
            parser: 'tsx',
          }
        );
      });
    });

    afterEach(() => {
      jest.resetModules();
    });

    tests.forEach((test) =>
      defineTest(
        __dirname,
        'name-default-component',
        null,
        `name-default-component/${test}`
      )
    );
  });
});
