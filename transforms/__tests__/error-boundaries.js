/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree. 
 *
 */

'use strict';

const tests = ['class-component', 'create-class-component'];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

tests.forEach(test => {
  defineTest(__dirname, 'error-boundaries', null, `error-boundaries/${test}`);
});
