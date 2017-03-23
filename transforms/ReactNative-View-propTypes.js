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

const isRootJSXViewReference = path => (
  path.node.name === 'View' &&
  path.parent.node.type === 'JSXOpeningElement'
);

const isRootViewReference = path => (
  path.node.name === 'View' &&
  path.parent.node.type !== 'MemberExpression' &&
  path.node.type !== 'JSXIdentifier' &&
  (
    path.parent.node.type !== 'ImportSpecifier' ||
    path.parent.node.imported === path.node
  ) &&
  (
    path.parent.node.type !== 'Property' ||
    path.parent.node.key === path.node
  )
);

const isViewImport = path => (
  path.node.specifiers.some(specifier => (
    specifier.imported &&
    specifier.imported.name === 'View' ||
    specifier.local &&
    specifier.local.name === 'View'
  ))
);

const isViewRequire = path => (
  path.node.callee.type === 'Identifier' &&
  path.parent.node.type === 'VariableDeclarator' &&
  (
    path.parent.node.id.type === 'Identifier' &&
    path.parent.node.id.name === 'View' ||
    path.parent.node.id.type === 'ObjectPattern' &&
    path.parent.node.id.properties.some(
      property => property.value.name === 'View'
    )
  )
);

const isViewPropTypes = path => (
  path.node.name === 'propTypes' &&
  path.parent.node.type === 'MemberExpression' &&
  path.parent.value.object.name === 'View'
);

module.exports = function(file, api, options) {
  const j = api.jscodeshift;

  let root = j(file.source);

  let numMatchedPaths = 0;

  // Search for remaining view references
  const viewReferenceCount = root
    .find(j.Identifier)
    .filter(isRootViewReference)
    .length;
  const jsxViewReferenceCount = root
    .find(j.JSXIdentifier)
    .filter(isRootJSXViewReference)
    .length;

  // Replace View.propTypes with ViewPropTypes
  root
    .find(j.Identifier)
    .filter(isViewPropTypes)
    .forEach(path => {
      numMatchedPaths++;

      j(path.parent).replaceWith(
        j.identifier('ViewPropTypes')
      );
    });

  // Add ViewPropTypes import
  if (numMatchedPaths > 0) {
    const fileUsesImports = root
      .find(j.ImportDeclaration)
      .length > 0;

    // Add a require statement or an import, based on file convention
    let importOrRequireStatement;
    if (fileUsesImports) {
      const identifier = j.identifier('ViewPropTypes');
      const variable = j.importDefaultSpecifier(identifier);

      importOrRequireStatement = j.importDeclaration(
        [variable], j.literal('ViewPropTypes')
      );
    } else {
      importOrRequireStatement = j.template.statement`
        const ViewPropTypes = require('ViewPropTypes');
      `;
    }

    // If the only View reference left is the import/require(), replace it
    // Else insert our new import/require() after it
    const replaceExistingImportOrRequireStatement = viewReferenceCount + jsxViewReferenceCount <= numMatchedPaths;

    if (fileUsesImports) {
      root
        .find(j.ImportDeclaration)
        .filter(isViewImport)
        .forEach(path => {
          if (path.node.specifiers.length > 1) {
            // Destructured import ...

            // Insert after before removing to avoid an error
            j(path).insertAfter(importOrRequireStatement);

            if (replaceExistingImportOrRequireStatement) {
              // If this is the last reference to a destructured import, remove it
              // We can't replace in this case b'c the destination is different
              path.node.specifiers = path.node.specifiers.filter(
                specifier => specifier.local.name !== 'View'
              );
            }
          } else {
            // Default import ...

            if (replaceExistingImportOrRequireStatement) {
              j(path).replaceWith(importOrRequireStatement);
            } else {
              j(path).insertAfter(importOrRequireStatement);
            }
          }
        });
    } else {
      root
        .find(j.CallExpression, {callee: {name: 'require'}})
        .filter(isViewRequire)
        .forEach(path => {
          if (path.parent.node.id.type === 'ObjectPattern') {
            // Destructured require() ...

            // Insert after before removing to avoid an error
            j(path.parent.parent).insertAfter(importOrRequireStatement);

            if (replaceExistingImportOrRequireStatement) {
              // If this is the last reference to a destructured import, remove it
              // We can't replace in this case b'c the destination is different
              const variableDeclarator = path.parent.parent.value.declarations[0];
              variableDeclarator.id.properties = variableDeclarator.id.properties.filter(
                property => property.value.name !== 'View'
              );
            }
          } else {
            // Default require ...

            if (replaceExistingImportOrRequireStatement) {
              j(path.parent.parent).replaceWith(importOrRequireStatement);
            } else {
              j(path.parent.parent).insertAfter(importOrRequireStatement);
            }
          }
        });
    }
  }

  return numMatchedPaths > 0
    ? root.toSource({ quote: 'single' })
    : null;
};
