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

module.exports = function(j) {
  const REACT_CREATE_CLASS_MEMBER_EXPRESSION = {
    type: 'MemberExpression',
    object: {
      name: 'React',
    },
    property: {
      name: 'createClass',
    },
  };

  // ---------------------------------------------------------------------------
  // Checks if the file requires a certain module
  const hasModule = (path, module) =>
    path
      .findVariableDeclarators()
      .filter(j.filters.VariableDeclarator.requiresModule(module))
      .size() === 1 ||
    path
      .find(j.ImportDeclaration, {
        type: 'ImportDeclaration',
        source: {
          type: 'Literal',
        },
      })
      .filter(declarator => declarator.value.source.value === module)
      .size() === 1;

  const hasReact = path => (
    hasModule(path, 'React') ||
    hasModule(path, 'react') ||
    hasModule(path, 'react/addons') ||
    hasModule(path, 'react-native')
  );

  // ---------------------------------------------------------------------------
  // Finds all variable declarations that call React.createClass
  const findReactCreateClassCallExpression = path =>
    j(path).find(j.CallExpression, {
      callee: REACT_CREATE_CLASS_MEMBER_EXPRESSION,
    });

  const findReactCreateClass = path =>
    path
      .findVariableDeclarators()
      .filter(decl => findReactCreateClassCallExpression(decl).size() > 0);

  const findReactCreateClassExportDefault = path =>
    path.find(j.ExportDefaultDeclaration, {
      declaration: {
        type: 'CallExpression',
        callee: REACT_CREATE_CLASS_MEMBER_EXPRESSION,
      },
    });

  const findReactCreateClassModuleExports = path =>
    path
      .find(j.AssignmentExpression, {
        left: {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            name: 'module',
          },
          property: {
            type: 'Identifier',
            name: 'exports',
          },
        },
        right: {
          type: 'CallExpression',
          callee: REACT_CREATE_CLASS_MEMBER_EXPRESSION,
        },
      });

  // ---------------------------------------------------------------------------
  // Finds alias for React.Component if used as named import.
  const findReactComponentName = path => {
    const reactImportDeclaration = path
      .find(j.ImportDeclaration, {
        type: 'ImportDeclaration',
        source: {
          type: 'Literal',
        },
      })
      .filter(importDeclaration => hasReact(path));

    const componentImportSpecifier = reactImportDeclaration
      .find(j.ImportSpecifier, {
        type: 'ImportSpecifier',
        imported: {
          type: 'Identifier',
          name: 'Component',
        },
      }).at(0);

    const paths = componentImportSpecifier.paths();
    return paths.length
      ? paths[0].value.local.name
      : undefined;
  };

  // Finds all classes that extend React.Component
  const findReactES6ClassDeclaration = path => {
    const componentImport = findReactComponentName(path);
    const selector = componentImport
      ? {
        superClass: {
          type: 'Identifier',
          name: componentImport,
        },
      }
      : {
        superClass: {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            name: 'React',
          },
          property: {
            type: 'Identifier',
            name: 'Component',
          },
        },
      };

    return path
     .find(j.ClassDeclaration, selector);
  };

  // ---------------------------------------------------------------------------
  // Checks if the React class has mixins
  const isMixinProperty = property => {
    const key = property.key;
    const value = property.value;
    return (
      key.name === 'mixins' &&
      value.type === 'ArrayExpression' &&
      Array.isArray(value.elements) &&
      value.elements.length
    );
  };

  const hasMixins = classPath => {
    const spec = getReactCreateClassSpec(classPath);
    return spec && spec.properties.some(isMixinProperty);
  };

  // ---------------------------------------------------------------------------
  // Others
  const getReactCreateClassSpec = classPath => {
    const {value} = classPath;
    const args = (value.init || value.right || value.declaration).arguments;
    if (args) {
      const spec = args[0];
      if (spec.type === 'ObjectExpression' && Array.isArray(spec.properties)) {
        return spec;
      }
    }
  };

  const getClassExtendReactSpec = classPath => classPath.value.body;

  const createCreateReactClassCallExpression = properties =>
    j.callExpression(
      j.memberExpression(
        j.identifier('React'),
        j.identifier('createClass'),
        false
      ),
      [j.objectExpression(properties)]
    );

  const getComponentName =
    classPath => classPath.node.id && classPath.node.id.name;

  return {
    createCreateReactClassCallExpression,
    findReactES6ClassDeclaration,
    findReactCreateClass,
    findReactCreateClassCallExpression,
    findReactCreateClassModuleExports,
    findReactCreateClassExportDefault,
    getComponentName,
    getReactCreateClassSpec,
    getClassExtendReactSpec,
    hasMixins,
    hasModule,
    hasReact,
    isMixinProperty,
  };
};
