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

describe('pure-render-mixin', () => {

  it('transforms correctly', () => {
    test('pure-render-mixin', 'pure-render-mixin-test');

    test('pure-render-mixin', 'pure-render-mixin-test2');

    test('pure-render-mixin', 'pure-render-mixin-test3');

    test('pure-render-mixin', 'pure-render-mixin-test4', {
      'mixin-name': 'ReactComponentWithPureRenderMixin',
    });
  });

});
