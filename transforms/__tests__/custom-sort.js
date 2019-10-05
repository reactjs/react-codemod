/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree. 
 *
 */

'use strict';

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

// The test fixtures for this are in their own dir so it can customize eslint.
defineTest(__dirname, 'sort-comp', null, 'custom-sort/custom-sort');
