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

  const isPropsProperty = node => (
    node.type === 'ClassProperty' &&
    node.key.type === 'Identifier' &&
    node.key.name === 'props'
  );

  const isStaticProperty = node => (
    node.type === 'ClassProperty' &&
    node.static
  );

  const onlyHasRenderMethod = path =>
    j(path)
      .find(j.MethodDefinition)
      .filter(p => !isRenderMethod(p.value))
      .size() === 0;

  const onlyHasSafeClassProperties = path =>
    j(path)
      .find(j.ClassProperty)
      .filter(p => !(isPropsProperty(p.value) || isStaticProperty(p.value)))
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

  const buildIdentifierWithTypeAnnotation = (name, typeAnnotation) => {
    const identifier = j.identifier(name);
    if (typeAnnotation) {
      identifier.typeAnnotation = j.typeAnnotation(typeAnnotation);
    }
    return identifier;
  };

  const findPropsTypeAnnotation = body => {
    const property = body.find(isPropsProperty);

    return property && property.typeAnnotation.typeAnnotation;
  };

  const buildPureComponentFunction = (name, body, typeAnnotation) =>
    j.functionDeclaration(
      j.identifier(name),
      [buildIdentifierWithTypeAnnotation('props', typeAnnotation)],
      body
    );

  const buildPureComponentArrowFunction = (name, body, typeAnnotation) =>
    j.variableDeclaration(
      'const', [
        j.variableDeclarator(
          j.identifier(name),
          j.arrowFunctionExpression(
            [buildIdentifierWithTypeAnnotation('props', typeAnnotation)],
            body
          )
        ),
      ]
    );

  const buildStatics = (name, properties) => properties.map(prop => (
    j.expressionStatement(
      j.assignmentExpression(
        '=',
        j.memberExpression(j.identifier(name), prop.key),
        prop.value
      )
    )
  ));

  const reportSkipped = path => {
    const name = getClassName(path);
    const fileName = file.path;
    if (!path.value.loc) {
      console.warn(`Class "${name}" skipped in ${fileName}`);
      return;
    }
    const {line, column} = path.value.loc.start;

    console.warn(`Class "${name}" skipped in ${fileName} on ${line}:${column}`);
  };

  const f = j(file.source);

  const pureClasses = ReactUtils.findReactES6ClassDeclaration(f)
    .filter(path => {
      const isPure = onlyHasRenderMethod(path) && onlyHasSafeClassProperties(path) && !hasRefs(path);
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
    const propsTypeAnnotation = findPropsTypeAnnotation(p.value.body.body);
    const statics = p.value.body.body.filter(isStaticProperty);

    replaceThisProps(renderBody);

    if (useArrows) {
      return [
        buildPureComponentArrowFunction(name, renderBody, propsTypeAnnotation),
        ...buildStatics(name, statics)
      ];
    } else {
      return [
        buildPureComponentFunction(name, renderBody, propsTypeAnnotation),
        ...buildStatics(name, statics)
      ];
    }
  });

  return f.toSource(printOptions);
};
