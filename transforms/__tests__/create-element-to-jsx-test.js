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

const defineTest = require('jscodeshift/dist/testUtils').defineTest;
const testOptions = { parser: 'flow' };

describe('create-element-to-jsx', () => {
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-single-element',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-props',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-props-boolean',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-props-array',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-children-literal',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-children',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-children-map',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-children-mixed-empty-string',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-spread',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-spread-props',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-no-react',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-literal-prop',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-call-as-children',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-react-spread',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-object-assign',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-member-expression-as-prop',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-call-expression-as-prop',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-allow-member-expression',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-gt-lt-entities',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-escaped-string',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-no-props-arg',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-preserve-comments',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-ignore-bad-capitalization',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-arg-spread',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-computed-component',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-deep-nesting',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-literal-spacing',
    testOptions
  );
  defineTest(
    __dirname,
    'create-element-to-jsx',
    null,
    'create-element-to-jsx-element-comment-positioning',
    testOptions
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
