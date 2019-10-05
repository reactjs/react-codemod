/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree. 
 *
 */

'use strict';

jest.mock('../pure-component', () => {
  return Object.assign(require.requireActual('../pure-component'), {
    parser: 'flow'
  });
});

const defineTest = require('jscodeshift/dist/testUtils').defineTest;
defineTest(__dirname, 'pure-component');
defineTest(__dirname, 'pure-component', { useArrows: true }, 'pure-component2');
defineTest(__dirname, 'pure-component', { destructuring: true }, 'pure-component-destructuring');
