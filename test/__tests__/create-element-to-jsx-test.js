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

describe('create-element-to-jsx', () => {

  it('transforms correctly', () => {
    test('create-element-to-jsx', 'create-element-to-jsx-single-element');

    test('create-element-to-jsx', 'create-element-to-jsx-props');

    test('create-element-to-jsx', 'create-element-to-jsx-props-boolean');

    test('create-element-to-jsx', 'create-element-to-jsx-props-array');

    test('create-element-to-jsx', 'create-element-to-jsx-children-literal');

    test('create-element-to-jsx', 'create-element-to-jsx-children');

    test('create-element-to-jsx', 'create-element-to-jsx-children-map');

    test('create-element-to-jsx', 'create-element-to-jsx-children-mixed-empty-string');

    test('create-element-to-jsx', 'create-element-to-jsx-spread');

    test('create-element-to-jsx', 'create-element-to-jsx-spread-props');

    test('create-element-to-jsx', 'create-element-to-jsx-no-react');

    test('create-element-to-jsx', 'create-element-to-jsx-literal-prop');

    test('create-element-to-jsx', 'create-element-to-jsx-call-as-children');

    test('create-element-to-jsx', 'create-element-to-jsx-react-spread');

    test('create-element-to-jsx', 'create-element-to-jsx-object-assign');

    test('create-element-to-jsx', 'create-element-to-jsx-member-expression-as-prop');

    test('create-element-to-jsx', 'create-element-to-jsx-call-expression-as-prop');

    test('create-element-to-jsx', 'create-element-to-jsx-allow-member-expression');

    test('create-element-to-jsx', 'create-element-to-jsx-gt-lt-entities');
  });

  it('raises when it does not recognize a property type', () => {
    const jscodeshift = require('jscodeshift');
    const transform = require('../../transforms/create-element-to-jsx');
    const source = `
      var React = require("react/addons");
      React.createElement("foo", 1)
    `;

    expect(() => transform({source}, {jscodeshift}, {}))
      .toThrow('Unexpected attribute of type "Literal"');
  });

});
