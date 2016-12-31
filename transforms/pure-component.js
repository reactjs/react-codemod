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
  const destructureEnabled = options.destructure || false;
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

  const canDestructure = path => path
    .find(j.Identifier, {
      name: 'props'
    })
    .filter(p => p.parentPath.parentPath.value.type !== 'MemberExpression')
    .size() === 0;

  const createShorthandProperty = j => prop => {
    const property = j.property('init', j.identifier(prop), j.identifier(prop));
    property.shorthand = true;
    return property;
  };

  const destructureProps = body => {
    const toDestructure = body.find(j.MemberExpression, {
      object: {
        name: 'props'
      }
    });
    if (toDestructure) {
      const propNames = [];
      toDestructure.forEach(path => propNames.push(path.value.property.name));
      toDestructure.replaceWith(path => j.identifier(path.value.property.name));
      if (propNames.length > 0) {
        return j.objectExpression(propNames.map(createShorthandProperty(j)));
      }
    }
    return false;
  };

  const findPropsTypeAnnotation = body => {
    const property = body.find(isPropsProperty);

    return property && property.typeAnnotation.typeAnnotation;
  };

  const build = ({ functionType }) => (name, body, typeAnnotation, destructure) => {
    const identifier = j.identifier(name);
    const propsIdentifier = buildIdentifierWithTypeAnnotation('props', typeAnnotation);
    const propsArg = [(destructure && destructureProps(j(body))) || propsIdentifier];
    if (functionType === 'fn') {
      return j.functionDeclaration(
        identifier,
        propsArg,
        body
      );
    } else { 
      return j.variableDeclaration(
        'const', [
          j.variableDeclarator(
            identifier,
            j.arrowFunctionExpression(
              propsArg,
              body
            )
          ),
        ]
      );
    }
  };

  const buildPureComponentFunction = build({ functionType: 'fn' });

  const buildPureComponentArrowFunction = build({ functionType: 'arrow' });

  const oldbuildPureComponentFunction = (name, body, typeAnnotation) =>
    j.functionDeclaration(
      j.identifier(name),
      [buildIdentifierWithTypeAnnotation('props', typeAnnotation)],
      body
    );

  const oldbuildPureComponentArrowFunction = (name, body, typeAnnotation, destructure) => {
    const propsIdentifier = buildIdentifierWithTypeAnnotation('props', typeAnnotation);
    const arg = (destructure && destructureProps(j(body))) || propsIdentifier;
    return j.variableDeclaration(
      'const', [
        j.variableDeclarator(
          j.identifier(name),
          j.arrowFunctionExpression(
            [arg],
            body
          )
        ),
      ]
    );
  };

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
    const destructure = destructureEnabled && canDestructure(j(renderMethod));

    if (destructureEnabled && !destructure) {
      console.warn(`Unable to destructure ${name} props. Render method references \`this.props\`.`);
    }

    replaceThisProps(renderBody);
    
    if (useArrows) {
      return [
        buildPureComponentArrowFunction(name, renderBody, propsTypeAnnotation, destructure),
        ...buildStatics(name, statics)
      ];
    } else {
      return [
        buildPureComponentFunction(name, renderBody, propsTypeAnnotation, destructure),
        ...buildStatics(name, statics)
      ];
    }
  });

  return f.toSource(printOptions);
};
