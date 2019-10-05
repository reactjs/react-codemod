/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree. 
 *
 */

'use strict';

const tests = [
  'arrow-functions',
  'create-react-class',
  'instance-methods',
  'manually-calling-lifecycles',
  'manually-invoked-mixin-methods',
  'one-lifecycle-calls-another',
  'standalone-function',
  'variable-within-class-method',
];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('rename-unsafe-lifecycles', () => {
  describe('flow', () => {
    beforeEach(() => {
      jest.mock('../rename-unsafe-lifecycles', () => {
        return Object.assign(
          require.requireActual('../rename-unsafe-lifecycles'),
          {
            parser: 'flow'
          }
        );
      });
    });

    afterEach(() => {
      jest.resetModules();
    });

    tests.forEach(test =>
      defineTest(
        __dirname,
        'rename-unsafe-lifecycles',
        null,
        `rename-unsafe-lifecycles/${test}`
      )
    );
  });

  describe('typescript', () => {
    beforeEach(() => {
      jest.mock('../rename-unsafe-lifecycles', () => {
        return Object.assign(
          require.requireActual('../rename-unsafe-lifecycles'),
          {
            parser: 'tsx'
          }
        );
      });
    });

    afterEach(() => {
      jest.resetModules();
    });

    defineTest(
      __dirname,
      'rename-unsafe-lifecycles',
      null,
      'rename-unsafe-lifecycles/typescript/class.tsx'
    );
  });
});
