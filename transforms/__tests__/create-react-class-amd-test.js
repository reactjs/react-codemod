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

const tests = [
  'create-react-class-amd',
  'react-not-in-use-amd'
];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('create-react-class-amd', () => {
  tests.forEach(test =>
    defineTest(
      __dirname,
      'create-react-class-amd',
      null,
      `create-react-class-amd/${ test }`
    )
  );
});
