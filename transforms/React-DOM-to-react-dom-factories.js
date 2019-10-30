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
  const printOptions = options.printOptions || { quote: 'single' };
  const root = j(file.source);

  let hasModifications;

  const DOMModuleName = 'DOM';

  /**
   * Replaces 'DOM' with 'createElement' in places where we grab 'DOM' out of
   * 'React' with destructuring.
   * Note that this only picks up 'DOM' when required from React or
   * require('react')
   */
  const replaceDestructuredDOMStatement = (j, root) => {
    let hasModifications = false;
    //---------
    // First update import statments. eg:
    // import {
    //   DOM,
    //   foo,
    // } from 'react';
    root
      .find(j.ImportDeclaration)
      .filter(
        path =>
          path.node.specifiers.filter(
            specifier =>
              specifier.imported && specifier.imported.name === DOMModuleName
          ).length > 0 && path.node.source.value === 'react'
      )
      .forEach(path => {
        hasModifications = true;

        // Replace the DOM key with 'createElement'
        path.node.specifiers = path.node.specifiers.map(specifier => {
          if (specifier.imported && specifier.imported.name === DOMModuleName) {
            return j.importSpecifier(j.identifier('createElement'));
          } else {
            return specifier;
          }
        });
      });

    //---------
    // Next update require statments.
    // This matches both
    // const {
    //   Component,
    //   DOM,
    // } = React;
    // and
    // const {
    //   Component,
    //   DOM,
    // } = require('react');
    root
      .find(j.ObjectPattern)
      .filter(
        path =>
          path.parent.node.init &&
          // matches '} = React;'
          (path.parent.node.init.name === 'React' ||
            // matches "} = require('react');"
            (path.parent.node.init.type === 'CallExpression' &&
              path.parent.node.init.callee.name === 'require' &&
              path.parent.node.init.arguments[0].value === 'react')) &&
          path.node.properties.some(property => {
            return property.key.name === DOMModuleName;
          })
      )
      .forEach(path => {
        hasModifications = true;

        // Replace the DOM key with 'createElement'
        path.node.properties = path.node.properties.map(property => {
          if (property.key.name === DOMModuleName) {
            return j.identifier('createElement');
          } else {
            return property;
          }
        });
      });
    return hasModifications;
  };

  hasModifications =
    replaceDestructuredDOMStatement(j, root) || hasModifications;

  if (hasModifications) {
    // if we 'hasModifications' then we found and replaced a reference to
    // '{DOM} = React;' or '{DOM} = require('react');'
    // In this case we need to update 'DOM.<element>' syntax

    /**
     * Update cases where DOM.div is being called
     * eg 'foo = DOM.div('a'...'
     * replace with 'foo = createElement('div', 'a'...'
     */
    function replaceDOMReferences(j, root) {
      let hasModifications = false;

      const isDOMIdentifier = path =>
        path.node.name === DOMModuleName &&
        path.parent.parent.node.type === 'CallExpression';

      root
        .find(j.Identifier)
        .filter(isDOMIdentifier)
        .forEach(path => {
          hasModifications = true;

          const DOMargs = path.parent.parent.node.arguments;
          const DOMFactoryPath = path.parent.node.property;
          const DOMFactoryType = DOMFactoryPath.name;

          // DOM.div(... -> createElement(...
          j(path.parent).replaceWith(j.identifier('createElement'));
          // createElement(... -> createElement('div', ...
          DOMargs.unshift(j.literal(DOMFactoryType));
        });

      return hasModifications;
    }

    hasModifications = replaceDOMReferences(j, root) || hasModifications;
  }

  /**
   * Update React.DOM references
   * eg 'foo = React.DOM.div('a'...'
   * replace with 'foo = React.createElement('div', 'a'...'
   */
  function replaceReactDOMReferences(j, root) {
    let hasModifications = false;

    // matches 'React.DOM'
    const isReactDOMIdentifier = path =>
      path.node.name === DOMModuleName &&
      (path.parent.node.type === 'MemberExpression' &&
        path.parent.node.object.name === 'React');

    root
      .find(j.Identifier)
      .filter(isReactDOMIdentifier)
      .forEach(path => {
        hasModifications = true;
        const DOMargs = path.parent.parent.parent.node.arguments;
        const DOMFactoryPath = path.parent.parent.node.property;
        const DOMFactoryType = DOMFactoryPath.name;

        // React.DOM.div(... -> React.DOM.createElement(...
        path.parent.parent.node.property = j.identifier('createElement');
        // React.DOM.createElement(... -> React.createElement(...
        j(path.parent).replaceWith(j.identifier('React'));
        // React.createElement(... -> React.createElement('div'...
        DOMargs.unshift(j.literal(DOMFactoryType));
      });

    return hasModifications;
  }

  hasModifications = replaceReactDOMReferences(j, root) || hasModifications;

  return hasModifications ? root.toSource(printOptions) : null;
};
