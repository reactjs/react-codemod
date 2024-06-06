/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

const defineTest = require('jscodeshift/dist/testUtils').defineTest;
defineTest(__dirname, 'sort-comp', null, 'sort-comp/sort-comp');
defineTest(__dirname, 'sort-comp', null, 'sort-comp/sort-comp2');
defineTest(__dirname, 'sort-comp', null, 'sort-comp/sort-comp3');
defineTest(__dirname, 'sort-comp', null, 'sort-comp/sort-comp-pure');
defineTest(__dirname, 'sort-comp', null, 'sort-comp/sort-comp-instance-vars');
defineTest(__dirname, 'sort-comp', null, 'sort-comp/sort-comp-getters-setters');
defineTest(__dirname, 'sort-comp', null, 'sort-comp/sort-comp-default-props');
defineTest(__dirname, 'sort-comp', null, 'sort-comp/sort-comp-full');
