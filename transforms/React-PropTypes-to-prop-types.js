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

// Find alpha-sorted import that would follow prop-types
function findImportAfterPropTypes(j, root) {
  let target, targetName;

  root
    .find(j.ImportDeclaration)
    .forEach(path => {
      const name = path.value.source.value.toLowerCase();
      if (
        name > 'prop-types' &&
        (!target || name < targetName)
      ) {
        targetName = name;
        target = path;
      }
    });

  return target;
}

// Find alpha-sorted require that would follow prop-types
function findRequireAfterPropTypes(j, root) {
  let target, targetName;

  root
    .find(j.CallExpression, {callee: {name: 'require'}})
    .forEach(path => {
      const name = path.node.arguments[0].value.toLowerCase();
      if (
        name > 'prop-types' &&
        (!target || name < targetName)
      ) {
        targetName = name;
        target = path;
      }
    });

  return target;
}

// React.PropTypes
const isReactPropTypes = path => (
  path.node.name === 'PropTypes' &&
  path.parent.node.type === 'MemberExpression' &&
  path.parent.node.object.name === 'React'
);

// Program uses ES import syntax
function useImportSyntax(j, root) {
  return root
    .find(j.ImportDeclaration)
    .length > 0;
}

// Program uses var keywords
function useVar(j, root) {
  return root
    .find(j.VariableDeclaration, {kind: 'const'})
    .length === 0;
}

// If any PropTypes references exist, add a 'prop-types' import (or require)
function addPropTypesImport(j, root) {
  if (useImportSyntax(j, root)) {
    const importStatement = j.importDeclaration(
      [j.importDefaultSpecifier(j.identifier('PropTypes'))],
      j.literal('prop-types')
    );

    const path = findImportAfterPropTypes(j, root);

    j(path).insertBefore(importStatement);
  } else {
    const requireStatement = useVar(j, root)
      ? j.template.statement`var PropTypes = require('prop-types');\n`
      : j.template.statement`const PropTypes = require('prop-types');\n`;

    const path = findRequireAfterPropTypes(j, root);

    j(path.parent.parent).insertBefore(requireStatement);
  }
}

// Remove PropTypes destructure statements (eg const { ProptTypes } = React)
function removeDestructuredPropTypeStatements(j, root) {
  let hasModifications = false;

  root
    .find(j.ObjectPattern)
    .filter(path => (
      path.parent.node.init &&
      path.parent.node.init.name === 'React' &&
      path.node.properties.some(
          property => property.key.name === 'PropTypes'
        )
    ))
    .forEach(path => {
      hasModifications = true;

      // Remove the PropTypes key
      path.node.properties = path.node.properties.filter(
        property => property.key.name !== 'PropTypes'
      );

      // If this was the only property, remove the entire statement.
      if (path.node.properties.length === 0) {
        path.parent.parent.replace('');
      }
  });

  return hasModifications;
}

// Remove old { PropTypes } imports
function removePropTypesImport(j, root) {
  let hasModifications = false;

  root
    .find(j.Identifier)
    .filter(path => (
      path.node.name === 'PropTypes' &&
      path.parent.node.type === 'ImportSpecifier'
    ))
    .forEach(path => {
      hasModifications = true;

      const importDeclaration = path.parent.parent.node;
      importDeclaration.specifiers = importDeclaration.specifiers.filter(
        specifier => (
          !specifier.imported ||
          specifier.imported.name !== 'PropTypes'
        )
      );
    });

  return hasModifications;
}

// Replace all React.PropTypes instances with PropTypes
function replacePropTypesReferences(j, root) {
  let hasModifications = false;

  root
    .find(j.Identifier)
    .filter(isReactPropTypes)
    .forEach(path => {
      hasModifications = true;

      j(path.parent).replaceWith(
        j.identifier('PropTypes')
      );
    });

  return hasModifications;
}

function removeEmptyReactImport(j, root) {
  root
    .find(j.ImportDeclaration)
    .filter(path => (
      path.node.specifiers.length === 0 &&
      path.node.source.value === 'react'
    ))
    .replaceWith();
}

module.exports = function(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  let hasModifications = false;
  hasModifications = replacePropTypesReferences(j, root) || hasModifications;
  hasModifications = removePropTypesImport(j, root) || hasModifications;
  hasModifications = removeDestructuredPropTypeStatements(j, root) || hasModifications;

  if (hasModifications) {
    addPropTypesImport(j, root);
    removeEmptyReactImport(j, root);
  }

  return hasModifications
    ? root.toSource({ quote: 'single' })
    : null;
};
