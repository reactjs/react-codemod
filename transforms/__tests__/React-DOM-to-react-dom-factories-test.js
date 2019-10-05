/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree. 
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
  'react-dom-no-change-import-dom-from-other-libraries',
  'react-dom-no-change-require-dom-from-other-libraries',
  'react-dom-no-change-local-dom-from-other-libraries'
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
