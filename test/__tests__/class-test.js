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

describe('class', () => {

  it('transforms correctly', () => {
    test('class', 'class-test');

    test('class', 'class-test2');
  });

  it('transforms exports class correctly', () => {
    test('class', 'export-default-class-test');
  });

});
