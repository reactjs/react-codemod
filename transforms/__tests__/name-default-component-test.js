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
  'existing-name',
  'existing-name-ignore',
  '1-starts-with-number',
  'special-ch@racter',
];

describe('name-default-component', () => {
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
