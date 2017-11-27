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
describe('react-hyperscript-to-jsx', () => {
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-single-element'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-props'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-props-boolean'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-props-array'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-children-literal'
  // );
  defineTest(
    __dirname,
    'react-hyperscript-to-jsx',
    null,
    'react-hyperscript-to-jsx-children'
  );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-children-map'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-children-mixed-empty-string'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-spread'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-spread-props'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-no-react'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-literal-prop'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-call-as-children'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-react-spread'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-object-assign'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-member-expression-as-prop'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-call-expression-as-prop'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-allow-member-expression'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-gt-lt-entities'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-escaped-string'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-no-props-arg'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-preserve-comments'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-ignore-bad-capitalization'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-arg-spread'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-computed-component'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-deep-nesting'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-literal-spacing'
  // );
  // defineTest(
  //   __dirname,
  //   'react-hyperscript-to-jsx',
  //   null,
  //   'react-hyperscript-to-jsx-element-comment-positioning'
  // );

  it('throws when it does not recognize a property type', () => {
    const jscodeshift = require('jscodeshift');
    const transform = require('../../transforms/react-hyperscript-to-jsx');
    const source = `
      var React = require("react/addons");
      React.createElement("foo", 1)
    `;

    expect(() => transform({source}, {jscodeshift}, {}))
      .toThrowError('Unexpected attribute of type "Literal"');
  });
});