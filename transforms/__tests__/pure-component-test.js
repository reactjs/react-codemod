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

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

// Silence custom warnings from the transform while running tests
jest.spyOn(console, 'warn').mockImplementation();

const testOptions = { parser: 'flow' };

defineTest(__dirname, 'pure-component', null, null, testOptions);
defineTest(__dirname, 'pure-component', { useArrows: true }, 'pure-component2', testOptions);
defineTest(__dirname, 'pure-component', { destructuring: true }, 'pure-component-destructuring', testOptions);
