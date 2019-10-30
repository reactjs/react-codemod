/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

const isReactNativeImport = path =>
  path.parent.node.source.value === 'react-native';

const isReactNativeRequire = path =>
  path.node.arguments.some(argument => argument.value === 'react-native');

const isRootViewReference = path =>
  path.node.name === 'View' &&
  (path.parent.node.type !== 'MemberExpression' ||
    path.parent.node.object === path.node) &&
  (path.node.type !== 'JSXIdentifier' ||
    path.parent.node.type === 'JSXOpeningElement') &&
  (path.parent.node.type !== 'ImportSpecifier' ||
    path.parent.node.imported === path.node) &&
  (path.parent.node.type !== 'Property' || path.parent.node.key === path.node);

const isViewImport = path =>
  path.node.specifiers.some(
    specifier =>
      (specifier.imported && specifier.imported.name === 'View') ||
      (specifier.local && specifier.local.name === 'View')
  );

const isViewRequire = path =>
  path.node.callee.type === 'Identifier' &&
  path.parent.node.type === 'VariableDeclarator' &&
  ((path.parent.node.id.type === 'Identifier' &&
    path.parent.node.id.name === 'View') ||
    (path.parent.node.id.type === 'ObjectPattern' &&
      path.parent.node.id.properties.some(
        property => property.value.name === 'View'
      )));

const isViewPropTypes = path =>
  path.node.name === 'propTypes' &&
  path.parent.node.type === 'MemberExpression' &&
  path.parent.value.object.name === 'View';

// Note that this codemod may introduce an unnecessary newline before certain types of imports
// This is not a problem with the codemod but with recast
// See https://github.com/facebook/jscodeshift/issues/185
// See https://github.com/benjamn/recast/issues/371
module.exports = function(file, api, options) {
  const j = api.jscodeshift;

  const printOptions = options.printOptions || { quote: 'single' };
  let root = j(file.source);

  let numMatchedPaths = 0;

  // Search for all View references
  const viewReferenceCount = root.find(j.Identifier).filter(isRootViewReference)
    .length;

  // Replace View.propTypes with ViewPropTypes
  root
    .find(j.Identifier)
    .filter(isViewPropTypes)
    .forEach(path => {
      numMatchedPaths++;

      j(path.parent).replaceWith(j.identifier('ViewPropTypes'));
    });

  // Add ViewPropTypes import/require()
  if (numMatchedPaths > 0) {
    const fileUsesImports =
      root.find(j.CallExpression, { callee: { name: 'require' } }).length === 0;

    // Determine which kind of import/require() we should create based on file contents
    let useHasteModules = false;
    if (fileUsesImports) {
      useHasteModules =
        root.find(j.ImportSpecifier).filter(isReactNativeImport).length === 0;
    } else {
      useHasteModules =
        root
          .find(j.CallExpression, { callee: { name: 'require' } })
          .filter(isReactNativeRequire).length === 0;
    }

    // Create a require statement or an import, based on file convention
    let importOrRequireStatement;
    if (fileUsesImports) {
      const identifier = j.identifier('ViewPropTypes');
      const variable =
        useHasteModules === true
          ? j.importDefaultSpecifier(identifier)
          : j.importSpecifier(identifier);
      const source =
        useHasteModules === true ? 'ViewPropTypes' : 'react-native';

      importOrRequireStatement = j.importDeclaration(
        [variable],
        j.literal(source)
      );
    } else {
      if (useHasteModules === true) {
        importOrRequireStatement = j.template.statement`
          const ViewPropTypes = require('ViewPropTypes');
        `;
      } else {
        importOrRequireStatement = j.template.statement`
          const { ViewPropTypes } = require('react-native');
        `;
      }
    }

    // If the only View reference left is the import/require(), replace it
    // Else insert our new import/require() after it
    // Add one to avoid counting the import/require() statement itself
    const replaceExistingImportOrRequireStatement =
      viewReferenceCount <= numMatchedPaths + 1;

    if (fileUsesImports) {
      root
        .find(j.ImportDeclaration)
        .filter(isViewImport)
        .forEach(path => {
          // Differentiate between destructured and default import
          if (path.node.specifiers.length > 1) {
            if (useHasteModules) {
              // Insert after before removing to avoid an error
              j(path).insertAfter(importOrRequireStatement);

              if (replaceExistingImportOrRequireStatement) {
                // If this is the last reference to a destructured import, remove it
                // We can't replace in this case b'c the target/source is different
                path.node.specifiers = path.node.specifiers.filter(
                  specifier => specifier.local.name !== 'View'
                );
              }
            } else {
              if (replaceExistingImportOrRequireStatement) {
                const viewImport = path.node.specifiers.find(
                  specifier => specifier.local.name === 'View'
                );

                viewImport.local.name = 'ViewPropTypes';
              } else {
                path.node.specifiers.push(
                  j.importSpecifier(
                    j.identifier('ViewPropTypes'),
                    j.identifier('ViewPropTypes')
                  )
                );
              }
            }
          } else {
            if (replaceExistingImportOrRequireStatement) {
              j(path).replaceWith(importOrRequireStatement);
            } else {
              j(path).insertAfter(importOrRequireStatement);
            }
          }
        });
    } else {
      root
        .find(j.CallExpression, { callee: { name: 'require' } })
        .filter(isViewRequire)
        .forEach(path => {
          // Differentiate between destructured and default require()
          if (path.parent.node.id.type === 'ObjectPattern') {
            if (useHasteModules) {
              // Insert after before removing to avoid an error
              j(path.parent.parent).insertAfter(importOrRequireStatement);

              if (replaceExistingImportOrRequireStatement) {
                // If this is the last reference to a destructured import, remove it
                // We can't replace in this case b'c the target/source is different
                const variableDeclarator =
                  path.parent.parent.value.declarations[0];
                variableDeclarator.id.properties = variableDeclarator.id.properties.filter(
                  property => property.value.name !== 'View'
                );
              }
            } else {
              const objectPattern = path.parent;
              if (replaceExistingImportOrRequireStatement) {
                const property = objectPattern.node.id.properties.find(
                  property => property.value.name === 'View'
                );

                property.key.name = 'ViewPropTypes';
              } else {
                const property = j.property(
                  'init',
                  j.identifier('ViewPropTypes'),
                  j.identifier('ViewPropTypes')
                );
                property.shorthand = true;

                objectPattern.node.id.properties.push(property);
              }
            }
          } else {
            if (replaceExistingImportOrRequireStatement) {
              j(path.parent.parent).replaceWith(importOrRequireStatement);
            } else {
              j(path.parent.parent).insertAfter(importOrRequireStatement);
            }
          }
        });
    }
  }

  return numMatchedPaths > 0 ? root.toSource(printOptions) : null;
};
