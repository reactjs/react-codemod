/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree. 
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
    path.find(j.ExportDeclaration, {
      default: true,
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

  const getReactCreateClassSpec = classPath => {
    const {value} = classPath;
    const args = (value.init || value.right || value.declaration).arguments;
    if (args && args.length) {
      const spec = args[0];
      if (spec.type === 'ObjectExpression' && Array.isArray(spec.properties)) {
        return spec;
      }
    }
    return null;
  };

  // ---------------------------------------------------------------------------
  // Finds alias for React.Component if used as named import.
  const findReactComponentNameByParent = (path, parentClassName) => {
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
          name: parentClassName,
        },
      }).at(0);

    const paths = componentImportSpecifier.paths();
    return paths.length
      ? paths[0].value.local.name
      : undefined;
  };

  const removeUnusedSuperClassImport = (path, file, superClassName) => {
    if (path.find(j.Identifier, {
      type: 'Identifier',
      name: superClassName
    }).length === 0) {
      file.find(j.ImportSpecifier, {
        type: 'ImportSpecifier',
        imported: {
          type: 'Identifier',
          name: superClassName,
        }
      }).remove();
    }
  };

  const findReactES6ClassDeclarationByParent = (path, parentClassName) => {
    const componentImport = findReactComponentNameByParent(path, parentClassName);

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
            name: parentClassName,
          },
        },
      };

    return path
      .find(j.ClassDeclaration, selector);
  };

  // Finds all classes that extend React.Component
  const findReactES6ClassDeclaration = path => {
    let classDeclarations = findReactES6ClassDeclarationByParent(path, 'Component');
    if (classDeclarations.size() === 0) {
      classDeclarations = findReactES6ClassDeclarationByParent(path, 'PureComponent');
    }
    return classDeclarations;
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

  // ---------------------------------------------------------------------------
  // Direct methods! (see explanation below)
  const findAllReactCreateClassCalls = path =>
    path.find(j.CallExpression, {
      callee: REACT_CREATE_CLASS_MEMBER_EXPRESSION,
    });

  // Mixin Stuff
  const containSameElements = (ls1, ls2) => {
    if (ls1.length !== ls2.length) {
      return false;
    }

    return (
      ls1.reduce((res, x) => res && ls2.indexOf(x) !== -1, true) &&
      ls2.reduce((res, x) => res && ls1.indexOf(x) !== -1, true)
    );
  };

  const keyNameIsMixins = property => property.key.name === 'mixins';

  const isSpecificMixinsProperty = (property, mixinIdentifierNames) => {
    const key = property.key;
    const value = property.value;

    return (
      key.name === 'mixins' &&
      value.type === 'ArrayExpression' &&
      Array.isArray(value.elements) &&
      value.elements.every(elem => elem.type === 'Identifier') &&
      containSameElements(value.elements.map(elem => elem.name), mixinIdentifierNames)
    );
  };

  // These following methods assume that the argument is
  // a `React.createClass` call expression. In other words,
  // they should only be used with `findAllReactCreateClassCalls`.
  const directlyGetCreateClassSpec = classPath => {
    if (!classPath || !classPath.value) {
      return null;
    }
    const args = classPath.value.arguments;
    if (args && args.length) {
      const spec = args[0];
      if (spec.type === 'ObjectExpression' && Array.isArray(spec.properties)) {
        return spec;
      }
    }
    return null;
  };

  const directlyGetComponentName = classPath => {
    let result = '';
    if (
      classPath.parentPath.value &&
      classPath.parentPath.value.type === 'VariableDeclarator'
    ) {
      result = classPath.parentPath.value.id.name;
    }
    return result;
  };

  const directlyHasMixinsField = classPath => {
    const spec = directlyGetCreateClassSpec(classPath);
    return spec && spec.properties.some(keyNameIsMixins);
  };

  const directlyHasSpecificMixins = (classPath, mixinIdentifierNames) => {
    const spec = directlyGetCreateClassSpec(classPath);
    return spec && spec.properties.some(prop => isSpecificMixinsProperty(prop, mixinIdentifierNames));
  };

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
    removeUnusedSuperClassImport,

    // "direct" methods
    findAllReactCreateClassCalls,
    directlyGetComponentName,
    directlyGetCreateClassSpec,
    directlyHasMixinsField,
    directlyHasSpecificMixins,
  };
};
