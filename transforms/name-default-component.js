/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };
  const root = j(file.source);

  const hasArrowFunctionWithJSX = (node) =>
    node.type === 'ArrowFunctionExpression' &&
    node.body.type === 'BlockStatement' &&
    node.body.body.length === 1 &&
    node.body.body[0].type === 'ReturnStatement' &&
    node.body.body[0].argument &&
    node.body.body[0].argument.type === 'JSXElement';

  const nameFunctionComponent = (path) => {
    const node = path.value;
    const isUnnamedArrowFunction =
      node.declaration && hasArrowFunctionWithJSX(node.declaration);

    if (isUnnamedArrowFunction) {
      path.insertBefore(
        j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier('FunctionComponent'),
            node.declaration
          ),
        ])
      );

      node.declaration = j.identifier('FunctionComponent');
    }
  };

  root.find(j.ExportDefaultDeclaration).forEach(nameFunctionComponent);

  return root.toSource(printOptions);
};
