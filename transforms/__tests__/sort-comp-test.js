/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree. 
 *
 */

'use strict';

const defineTest = require('jscodeshift/dist/testUtils').defineTest;
defineTest(__dirname, 'sort-comp');
defineTest(__dirname, 'sort-comp', null, 'sort-comp2');
defineTest(__dirname, 'sort-comp', null, 'sort-comp3');
defineTest(__dirname, 'sort-comp', null, 'sort-comp-pure');
