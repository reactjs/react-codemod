/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

module.exports = function(file, api, options) {
  const j = api.jscodeshift;
  const ReactUtils = require('./utils/ReactUtils')(j);

  const useArrows = options.useArrows || false;
  const destructuringEnabled = options.destructuring || false;
  const silenceWarnings = options.silenceWarnings || false;
  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true
  };

  const getClassName = path => path.node.id.name;

  const isRenderMethod = node =>
    node.type == 'MethodDefinition' &&
    node.key.type == 'Identifier' &&
    node.key.name == 'render';

  const isPropsProperty = node =>
    node.type === 'ClassProperty' &&
    node.key.type === 'Identifier' &&
    node.key.name === 'props';

  const isStaticProperty = node => node.type === 'ClassProperty' && node.static;

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
          name: 'ref'
        }
      })
      .size() > 0;

  const THIS_PROPS = {
    object: {
      type: 'ThisExpression'
    },
    property: {
      name: 'props'
    }
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

  const isDuplicateDeclaration = (path, pre) => {
    if (path && path.value && path.value.id && path.value.init) {
      const initName = pre
        ? path.value.init.property && path.value.init.property.name
        : path.value.init.name;
      return path.value.id.name === initName;
    }
    return false;
  };

  const needsThisDotProps = path =>
    path
      .find(j.Identifier, {
        name: 'props'
      })
      .filter(p => p.parentPath.parentPath.value.type !== 'MemberExpression')
      .size() > 0;

  const getPropNames = path => {
    const propNames = new Set();
    path
      .find(j.MemberExpression, {
        object: {
          property: {
            name: 'props'
          }
        }
      })
      .forEach(p => {
        propNames.add(p.value.property.name);
      });
    return propNames;
  };

  const getDuplicateNames = path => {
    const duplicates = new Set();
    path
      .find(j.VariableDeclarator)
      .filter(p => isDuplicateDeclaration(p, true))
      .forEach(p => {
        duplicates.add(p.value.id.name);
      });
    return duplicates;
  };

  const getAssignmentNames = path => {
    const assignmentNames = new Set();
    path
      .find(j.Identifier)
      .filter(p => {
        if (p.value.type === 'JSXIdentifier') {
          return false;
        }
        if (
          !(p.parentPath.value.object && p.parentPath.value.object.property)
        ) {
          return true;
        }
        return p.parentPath.value.object.property.name !== 'props';
      })
      .forEach(p => {
        assignmentNames.add(p.value.name);
      });
    return assignmentNames;
  };

  const hasAssignmentsThatShadowProps = path => {
    const propNames = getPropNames(path);
    const assignmentNames = getAssignmentNames(path);
    const duplicates = getDuplicateNames(path);
    return Array.from(propNames).some(
      prop => !duplicates.has(prop) && assignmentNames.has(prop)
    );
  };

  const canDestructure = path =>
    !needsThisDotProps(path) && !hasAssignmentsThatShadowProps(path);

  const createShorthandProperty = (j, typeAnnotation) => prop => {
    const property = j.property('init', j.identifier(prop), j.identifier(prop));
    property.shorthand = true;
    if (typeAnnotation) {
      typeAnnotation.properties.forEach(t => {
        if (t.key.name === prop) {
          property.key.typeAnnotation = j.typeAnnotation(t.value);
        }
      });
    }
    return property;
  };

  const destructureProps = (body, typeAnnotation) => {
    const toDestructure = body.find(j.MemberExpression, {
      object: {
        name: 'props'
      }
    });
    if (toDestructure) {
      const propNames = new Set();
      toDestructure.replaceWith(path => {
        const propName = path.value.property.name;
        propNames.add(propName);
        return j.identifier(propName);
      });
      if (propNames.size > 0) {
        const assignments = body.find(j.VariableDeclarator);
        const duplicateAssignments = assignments.filter(a =>
          isDuplicateDeclaration(a, false)
        );
        duplicateAssignments.remove();
        return j.objectPattern(
          Array.from(propNames).map(createShorthandProperty(j, typeAnnotation))
        );
      }
    }
    return false;
  };

  const findPropsTypeAnnotation = body => {
    const property = body.find(isPropsProperty);

    return property && property.typeAnnotation.typeAnnotation;
  };

  const isDefaultExport = path =>
    path.parentPath && path.parentPath.value.type === 'ExportDefaultDeclaration';

  const safelyDefaultExportDeclaration = (path) => {
    const localName = path.value.declarations[0].id.name;
    j(path.parent)
      .replaceWith(_ => path.value)
      .insertAfter(
        j.exportDeclaration(true, { type: 'Identifier', name: localName })
      );
  };

  const build = useArrows => (name, body, typeAnnotation, destructure, hasThisDotProps) => {
    const identifier = j.identifier(name);
    const propsIdentifier = buildIdentifierWithTypeAnnotation(
      'props',
      typeAnnotation
    );

    const propsArg = hasThisDotProps ? [
      (destructure && destructureProps(j(body), typeAnnotation)) ||
        propsIdentifier
    ] : [];
    if (useArrows) {
      return j.variableDeclaration('const', [
        j.variableDeclarator(
          identifier,
          j.arrowFunctionExpression(propsArg, body)
        )
      ]);
    }
    return j.functionDeclaration(identifier, propsArg, body);
  };

  const buildPureComponentFunction = build();

  const buildPureComponentArrowFunction = build(true);

  const buildStatics = (name, properties) =>
    properties.map(prop =>
      j.expressionStatement(
        j.assignmentExpression(
          '=',
          j.memberExpression(j.identifier(name), prop.key),
          prop.value
        )
      )
    );

  const reportSkipped = path => {
    const name = getClassName(path);
    const fileName = file.path;
    if (!path.value.loc) {
      console.warn(`Class "${name}" skipped in ${fileName}`);
      return;
    }
    const { line, column } = path.value.loc.start;

    console.warn(`Class "${name}" skipped in ${fileName} on ${line}:${column}`);
  };

  const f = j(file.source);

  const pureClasses = ReactUtils.findReactES6ClassDeclaration(f).filter(
    path => {
      const isPure =
        onlyHasRenderMethod(path) &&
        onlyHasSafeClassProperties(path) &&
        !hasRefs(path);
      if (!isPure && !silenceWarnings) {
        reportSkipped(path);
      }

      return isPure;
    }
  );

  if (pureClasses.size() === 0) {
    return null;
  }

  // Save the names of the deleted pure classes super class
  // We need this to prune unused variables at the end.
  const parentClassNames = pureClasses.nodes().map(node => node.superClass.name);

  pureClasses.replaceWith(p => {
    const name = p.node.id.name;
    const renderMethod = p.value.body.body.filter(isRenderMethod)[0];
    const renderBody = renderMethod.value.body;
    const propsTypeAnnotation = findPropsTypeAnnotation(p.value.body.body);
    const statics = p.value.body.body.filter(isStaticProperty);
    const destructure = destructuringEnabled && canDestructure(j(renderMethod));

    if (destructuringEnabled && !destructure) {
      console.warn(`Unable to destructure ${name} props.`);
    }

    const hasThisDotProps = j(renderBody).find(j.MemberExpression, THIS_PROPS).length > 0;
    replaceThisProps(renderBody);

    if (useArrows) {
      return [
        buildPureComponentArrowFunction(
          name,
          renderBody,
          propsTypeAnnotation,
          destructure,
          hasThisDotProps
        ),
        ...buildStatics(name, statics)
      ];
    } else {
      return [
        buildPureComponentFunction(
          name,
          renderBody,
          propsTypeAnnotation,
          destructure,
          hasThisDotProps
        ),
        ...buildStatics(name, statics)
      ];
    }
  }).forEach(p => {
    // Check for combining default keyword with const declaration
    if (useArrows && isDefaultExport(p)) {
      safelyDefaultExportDeclaration(p);
    }
  }).forEach((p, i) => {
    const parentClassName = parentClassNames[i];
    ReactUtils.removeUnusedSuperClassImport(j(p), f, parentClassName);
  });

  return f.toSource(printOptions);
};
