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
  'react-dom-basic-case',
  'react-dom-deconstructed-import',
  'react-dom-deconstructed-require',
  'react-dom-deconstructed-require-part-two',
  'react-dom-no-change-import',
  'react-dom-no-change-require',
  'react-dom-no-change-dom-from-other-libraries',
];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('React-DOM-to-react-dom-factories', () => {
  tests.forEach(test =>
    defineTest(
      __dirname,
      'React-DOM-to-react-dom-factories',
      null,
      `React-DOM-to-react-dom-factories/${ test }`
    )
  );
});
