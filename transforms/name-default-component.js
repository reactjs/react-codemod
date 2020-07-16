/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

const { basename, extname } = require('path');

const camelCase = (value) => {
  const val = value.replace(/[-_\s.]+(.)?/g, (match, chr) =>
    chr ? chr.toUpperCase() : ''
  );
  return val.substr(0, 1).toUpperCase() + val.substr(1);
};

const isValidIdentifier = (value) => /^[a-zA-ZÀ-ÿ][0-9a-zA-ZÀ-ÿ]+$/.test(value);

const isArrowFunction = (node) => node.type === 'ArrowFunctionExpression';

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };
  const root = j(file.source);

  const returnsJSX = (node) =>
    node.type === 'JSXElement' ||
    (node.type === 'BlockStatement' &&
      j(node)
        .find(j.ReturnStatement)
        .some(
          (path) =>
            path.value.argument && path.value.argument.type === 'JSXElement'
        ));

  const nameFunctionComponent = (path) => {
    const node = path.value;
    const isUnnamedArrowFunction =
      node.declaration &&
      isArrowFunction(node.declaration) &&
      returnsJSX(node.declaration.body);

    if (!isUnnamedArrowFunction) {
      return;
    }

    const fileName = basename(file.path, extname(file.path));
    const name = camelCase(fileName);

    // If the generated name looks off, don't set a name for this component
    if (!isValidIdentifier(name)) {
      return;
    }

    path.insertBefore(
      j.variableDeclaration('const', [
        j.variableDeclarator(j.identifier(name), node.declaration),
      ])
    );

    node.declaration = j.identifier(name);
  };

  root.find(j.ExportDefaultDeclaration).forEach(nameFunctionComponent);

  return root.toSource(printOptions);
};
