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

describe('append px to style properties', () => {

  it('transforms correctly', () => {

    test('append-px-to-style-properties', 'append-px-to-style-properties-basic-transform', {
      printOptions: {quote: 'single'},
    });

    test('append-px-to-style-properties', 'append-px-to-style-properties-no-suffix-props-not-transformed', {
      printOptions: {quote: 'single'},
    });

    test('append-px-to-style-properties', 'append-px-to-style-properties-cond-expression-identifier', {
      printOptions: {quote: 'single'},
    });

    test('append-px-to-style-properties', 'append-px-to-style-properties-conditional-expression', {
      printOptions: {quote: 'single'},
    });

    test('append-px-to-style-properties', 'append-px-to-style-properties-negative-number', {
      printOptions: {quote: 'single'},
    });

    test('append-px-to-style-properties', 'append-px-to-style-properties-object-assign', {
      printOptions: {quote: 'single'},
    });

    test('append-px-to-style-properties', 'append-px-to-style-properties-spread-properties', {
      printOptions: {quote: 'single'},
    });

  });

  it('transforms correctly and ignores specified properties', () => {
    test('append-px-to-style-properties', 'append-px-to-style-properties-ignore-option', {
      ignore: 'fontSize',
      printOptions: {quote: 'single'},
    });
  });  
});
