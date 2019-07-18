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

jest.mock('../pure-component', () => {
  return Object.assign(require.requireActual('../pure-component'), {
    parser: 'flow'
  });
});

const defineTest = require('jscodeshift/dist/testUtils').defineTest;
defineTest(__dirname, 'pure-component');
defineTest(__dirname, 'pure-component', { useArrows: true }, 'pure-component2');
defineTest(__dirname, 'pure-component', { destructuring: true }, 'pure-component-destructuring');
