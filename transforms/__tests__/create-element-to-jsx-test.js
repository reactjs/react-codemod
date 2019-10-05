/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree. 
 *
 */

'use strict';

jest.mock('../create-element-to-jsx', () => {
  return Object.assign(require.requireActual('../create-element-to-jsx'), {
    parser: 'flow'
  });
});

const defineTest = require('jscodeshift/dist/testUtils').defineTest;
describe('create-element-to-jsx', () => {
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-single-element'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-props'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-props-boolean'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-props-array'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-children-literal'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-children'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-children-map'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-children-mixed-empty-string'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-spread'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-spread-props'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-no-react'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-literal-prop'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-call-as-children'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-react-spread'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-object-assign'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-member-expression-as-prop'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-call-expression-as-prop'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-allow-member-expression'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-gt-lt-entities'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-escaped-string'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-no-props-arg'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-preserve-comments'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-ignore-bad-capitalization'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-arg-spread'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-computed-component'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-deep-nesting'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-literal-spacing'
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-element-comment-positioning'
  );

  it('throws when it does not recognize a property type', () => {
    const jscodeshift = require('jscodeshift');
    const transform = require('../../transforms/create-element-to-jsx');
    const source = `
      var React = require("react/addons");
      React.createElement("foo", 1)
    `;

    expect(() => transform({source}, {jscodeshift}, {}))
      .toThrowError('Unexpected attribute of type "Literal"');
  });
});
