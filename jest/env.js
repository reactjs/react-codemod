/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree. 
 *
 */

'use strict';

const fs = require('fs');
const p = require('path');

const read = fileName => fs.readFileSync(
  p.join(__dirname, global.baseDir, 'test', fileName),
  'utf8'
);

global.test = (transformName, testFileName, options, fakeOptions) => {
  console.warn(
    'react-codemod test() is deprecated. Please use jscodeshift testUtils ' +
    'instead. See http://dl.vc/jscodeshift-test'
  );

  const jscodeshift = require('jscodeshift');
  const source = read(testFileName + '.js');
  const output = read(testFileName + '.output.js');
  let path = testFileName + '.js';
  let transform = require(
    p.join(global.baseDir, '/transforms/', transformName)
  );
  if (transform.default) {
    transform = transform.default;
  }

  if (fakeOptions && fakeOptions.path) {
    path = fakeOptions.path;
  }

  expect(
    (transform({path, source}, {jscodeshift}, options || {}) || '').trim()
  ).toEqual(
    output.trim()
  );
};
