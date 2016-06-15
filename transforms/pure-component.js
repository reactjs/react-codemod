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

module.exports = function(file, api, options) {
  const j = api.jscodeshift;
  const ReactUtils = require('./utils/ReactUtils')(j);

  const useArrows = options.useArrows || false;
  const silenceWarnings = options.silenceWarnings || false;
  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  const getClassName = path =>
    path.node.id.name;

  const isRenderMethod = node => (
    node.type == 'MethodDefinition' &&
    node.key.type == 'Identifier' &&
    node.key.name == 'render'
  );

  const onlyHasRenderMethod = path =>
    j(path)
      .find(j.MethodDefinition)
      .filter(p => !isRenderMethod(p.value))
      .size() === 0;

  const hasRefs = path =>
    j(path)
      .find(j.JSXAttribute, {
        name: {
          type: 'JSXIdentifier',
          name: 'ref',
        },
      })
      .size() > 0;

  const THIS_PROPS = {
    object: {
      type: 'ThisExpression',
    },
    property: {
      name: 'props',
    },
  };

  const replaceThisProps = path =>
    j(path)
      .find(j.MemberExpression, THIS_PROPS)
      .replaceWith(j.identifier('props'));

  const buildPureComponentFunction = (name, body) =>
    j.functionDeclaration(
      j.identifier(name),
      [j.identifier('props')],
      body
    );

  const buildPureComponentArrowFunction = (name, body) =>
    j.variableDeclaration(
      'const', [
        j.variableDeclarator(
          j.identifier(name),
          j.arrowFunctionExpression(
            [j.identifier('props')],
            body
          )
        ),
      ]
    );

  const reportSkipped = path => {
    const name = getClassName(path);
    const fileName = file.path;
    const {line, column} = path.value.loc.start;

    console.warn(`Class "${name}" skipped in ${fileName} on ${line}:${column}`);
  };

  const f = j(file.source);

  const pureClasses = ReactUtils.findReactES6ClassDeclaration(f)
    .filter(path => {
      const isPure = onlyHasRenderMethod(path) && !hasRefs(path);
      if (!isPure && !silenceWarnings) {
        reportSkipped(path);
      }
      return isPure;
    });

  if (pureClasses.size() === 0) {
    return null;
  }

  pureClasses.replaceWith(p => {
    const name = p.node.id.name;
    const renderMethod = p.value.body.body.filter(isRenderMethod)[0];
    const renderBody = renderMethod.value.body;

    replaceThisProps(renderBody);

    if (useArrows) {
      return buildPureComponentArrowFunction(name, renderBody);
    } else {
      return buildPureComponentFunction(name, renderBody);
    }
  });

  return f.toSource(printOptions);
};
