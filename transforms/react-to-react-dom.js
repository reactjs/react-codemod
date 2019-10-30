/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var CORE_PROPERTIES = [
  'Children',
  'Component',
  'createElement',
  'cloneElement',
  'isValidElement',
  'PropTypes',
  'createClass',
  'createFactory',
  'createMixin',
  'DOM',
  '__spread'
];

var DOM_PROPERTIES = [
  'findDOMNode',
  'render',
  'unmountComponentAtNode',
  'unstable_batchedUpdates',
  'unstable_renderSubtreeIntoContainer'
];

var DOM_SERVER_PROPERTIES = ['renderToString', 'renderToStaticMarkup'];

function reportError(node, error) {
  throw new Error(
    `At ${node.loc.start.line}:${node.loc.start.column}: ${error}`
  );
}

function isRequire(path, moduleName) {
  return (
    path.value.type === 'CallExpression' &&
    path.value.callee.type === 'Identifier' &&
    path.value.callee.name === 'require' &&
    path.value.arguments.length === 1 &&
    path.value.arguments[0].type === 'Literal' &&
    path.value.arguments[0].value === moduleName
  );
}

module.exports = function(file, api, options) {
  var j = api.jscodeshift;

  var printOptions = options.printOptions || { quote: 'single' };
  var root = j(file.source);

  [
    ['React', 'ReactDOM', 'ReactDOMServer'],
    ['react', 'react-dom', 'react-dom/server']
  ].forEach(function(pair) {
    var coreModuleName = pair[0];
    var domModuleName = pair[1];
    var domServerModuleName = pair[2];

    var domAlreadyDeclared = false;
    var domServerAlreadyDeclared = false;

    var coreRequireDeclarator;
    var coreImportDeclaration;
    var coreName = null;
    root
      .find(j.CallExpression)
      .filter(p => isRequire(p, coreModuleName))
      .forEach(p => {
        var name, scope;
        if (p.parent.value.type === 'VariableDeclarator') {
          if (p.parent.value.id.type === 'ObjectPattern') {
            var pattern = p.parent.value.id;
            var all = pattern.properties.every(function(prop) {
              if (prop.key.type === 'Identifier') {
                name = prop.key.name;
                return CORE_PROPERTIES.indexOf(name) !== -1;
              }
              return false;
            });
            if (all) {
              // var {PropTypes} = require('React'); so leave alone
              return;
            }
          }
          if (coreRequireDeclarator) {
            reportError(p.value, 'Multiple declarations of React');
          }
          if (p.parent.value.id.type !== 'Identifier') {
            reportError(
              p.value,
              'Unexpected destructuring in require of ' + coreModuleName
            );
          }
          name = p.parent.value.id.name;
          scope = p.scope.lookup(name);
          if (scope.declares('ReactDOM')) {
            console.log('Using existing ReactDOM var in ' + file.path);
            domAlreadyDeclared = true;
          }
          if (scope.declares('ReactDOMServer')) {
            console.log('Using existing ReactDOMServer var in ' + file.path);
            domServerAlreadyDeclared = true;
          }
          coreRequireDeclarator = p.parent;
          coreName = coreRequireDeclarator.value.id.name;
        } else if (p.parent.value.type === 'AssignmentExpression') {
          if (p.parent.value.left.type !== 'Identifier') {
            reportError(
              p.value,
              'Unexpected destructuring in require of ' + coreModuleName
            );
          }
          name = p.parent.value.left.name;
          scope = p.scope.lookup(name);
          var reactBindings = scope.getBindings()[name];
          if (reactBindings.length !== 1) {
            throw new Error(
              'Unexpected number of bindings: ' + reactBindings.length
            );
          }
          coreRequireDeclarator = reactBindings[0].parent;
          coreName = coreRequireDeclarator.value.id.name;
          if (
            coreRequireDeclarator.value.init &&
            !isRequire(coreRequireDeclarator.get('init'), coreModuleName)
          ) {
            reportError(
              coreRequireDeclarator.value,
              'Unexpected initialization of ' + coreModuleName
            );
          }
          if (scope.declares('ReactDOM')) {
            console.log('Using existing ReactDOM var in ' + file.path);
            domAlreadyDeclared = true;
          }
          if (scope.declares('ReactDOMServer')) {
            console.log('Using existing ReactDOMServer var in ' + file.path);
            domServerAlreadyDeclared = true;
          }
        }
      });
    root
      .find(j.ImportDeclaration, { source: { value: coreModuleName } })
      .forEach(p => {
        if (coreImportDeclaration) {
          reportError(p.value, 'Multiple declarations of React');
        }
        coreImportDeclaration = p;
        var defaultSpecifier = p.value.specifiers.find(
          sp => sp.type === j.ImportDefaultSpecifier.name
        );
        if (defaultSpecifier) {
          var name = defaultSpecifier.local.name;
          var scope = p.scope.lookup(name);
          if (scope.declares('ReactDOM')) {
            console.log('Using existing ReactDOM var in ' + file.path);
            domAlreadyDeclared = true;
          }
          if (scope.declares('ReactDOMServer')) {
            console.log('Using existing ReactDOMServer var in ' + file.path);
            domServerAlreadyDeclared = true;
          }
          coreName = j(coreImportDeclaration)
            .find(j.ImportDefaultSpecifier)
            .get().value.local.name;
        }
      });

    if (!coreRequireDeclarator && !coreImportDeclaration) {
      return;
    }

    if (
      !domAlreadyDeclared &&
      root.find(j.Identifier, { name: 'ReactDOM' }).size() > 0
    ) {
      throw new Error(
        'ReactDOM is already defined in a different scope than React'
      );
    }
    if (
      !domServerAlreadyDeclared &&
      root.find(j.Identifier, { name: 'ReactDOMServer' }).size() > 0
    ) {
      throw new Error(
        'ReactDOMServer is already defined in a different scope than React'
      );
    }

    var processed = new Set();
    var requireAssignments = [];
    var coreUses = 0;
    var domUses = 0;
    var domServerUses = 0;

    root.find(j.Identifier, { name: coreName }).forEach(p => {
      if (processed.has(p.value)) {
        // https://github.com/facebook/jscodeshift/issues/36
        return;
      }
      processed.add(p.value);
      if (
        p.parent.value.type === 'MemberExpression' ||
        p.parent.value.type === 'QualifiedTypeIdentifier'
      ) {
        var left;
        var right;
        if (p.parent.value.type === 'MemberExpression') {
          left = p.parent.value.object;
          right = p.parent.value.property;
        } else {
          left = p.parent.value.qualification;
          right = p.parent.value.id;
        }
        if (left === p.value) {
          // React.foo (or React[foo])
          if (right.type === 'Identifier') {
            var name = right.name;
            if (CORE_PROPERTIES.indexOf(name) !== -1) {
              coreUses++;
            } else if (DOM_PROPERTIES.indexOf(name) !== -1) {
              domUses++;
              j(p).replaceWith(j.identifier('ReactDOM'));
            } else if (DOM_SERVER_PROPERTIES.indexOf(name) !== -1) {
              domServerUses++;
              j(p).replaceWith(j.identifier('ReactDOMServer'));
            } else {
              throw new Error('Unknown property React.' + name);
            }
          }
        } else if (right === p.value) {
          // foo.React, no need to transform
        } else {
          throw new Error('unimplemented');
        }
      } else if (p.parent.value.type === 'VariableDeclarator') {
        if (p.parent.value.id === p.value) {
          // var React = ...;
        } else if (p.parent.value.init === p.value) {
          // var ... = React;
          var pattern = p.parent.value.id;
          if (pattern.type === 'ObjectPattern') {
            // var {PropTypes} = React;
            // Most of these cases will just be looking at {PropTypes} so this
            // is usually a no-op.
            var coreProperties = [];
            var domProperties = [];
            pattern.properties.forEach(function(prop) {
              if (prop.key.type === 'Identifier') {
                var key = prop.key.name;
                if (CORE_PROPERTIES.indexOf(key) !== -1) {
                  coreProperties.push(prop);
                } else if (DOM_PROPERTIES.indexOf(key) !== -1) {
                  domProperties.push(prop);
                } else {
                  throw new Error(
                    'Unknown property React.' + key + ' while destructuring'
                  );
                }
              } else {
                throw new Error('unimplemented');
              }
            });
            var domDeclarator = j.variableDeclarator(
              j.objectPattern(domProperties),
              j.identifier('ReactDOM')
            );
            if (coreProperties.length && !domProperties.length) {
              // nothing to do
              coreUses++;
            } else if (domProperties.length && !coreProperties.length) {
              domUses++;
              j(p.parent).replaceWith(domDeclarator);
            } else {
              coreUses++;
              domUses++;
              var decl = j(p).closest(j.VariableDeclaration);
              decl.insertAfter(
                j.variableDeclaration(decl.get().value.kind, [domDeclarator])
              );
            }
          } else {
            throw new Error('unimplemented');
          }
        } else {
          throw new Error('unimplemented');
        }
      } else if (p.parent.value.type === 'AssignmentExpression') {
        if (p.parent.value.left === p.value) {
          if (isRequire(p.parent.get('right'), coreModuleName)) {
            requireAssignments.push(p.parent);
          } else {
            reportError(
              p.parent.value,
              'Unexpected assignment to ' + coreModuleName
            );
          }
        } else {
          throw new Error('unimplemented');
        }
      } else if (p.parent.value.type === 'ImportDefaultSpecifier') {
        // import React from "react";
      } else {
        reportError(p.value, 'unimplemented ' + p.parent.value.type);
      }
    });

    coreUses += root.find(j.JSXElement).size();

    function insertRequire(name, path) {
      var req = j.callExpression(j.identifier('require'), [j.literal(path)]);
      requireAssignments.forEach(function(requireAssignment) {
        requireAssignment.parent.insertAfter(
          j.expressionStatement(
            j.assignmentExpression('=', j.identifier(name), req)
          )
        );
      });
      coreRequireDeclarator.parent.insertAfter(
        j.variableDeclaration(coreRequireDeclarator.parent.value.kind, [
          j.variableDeclarator(
            j.identifier(name),
            coreRequireDeclarator.value.init ? req : null
          )
        ])
      );
    }

    if (coreRequireDeclarator) {
      if (domServerUses > 0 && !domServerAlreadyDeclared) {
        insertRequire('ReactDOMServer', domServerModuleName);
      }
      if (domUses > 0 && !domAlreadyDeclared) {
        insertRequire('ReactDOM', domModuleName);
      }
      if ((domUses > 0 || domServerUses > 0) && coreUses === 0) {
        j(coreRequireDeclarator).remove();
        requireAssignments.forEach(r => j(r).remove());
      }
    } else {
      function findImportPath(name, path) {
        return root
          .find(j.ImportDeclaration, { source: { value: path } })
          .filter(p =>
            p.value.specifiers.find(
              sp =>
                sp.type === 'ImportDefaultSpecifier' && sp.local.name === name
            )
          );
      }

      function emitImport(name, path, knownProperties, uses) {
        const usedProperties = coreImportDeclaration.value.specifiers
          .filter(sp => sp.type === j.ImportSpecifier.name)
          .filter(
            sp =>
              sp.imported.type === 'Identifier' &&
              knownProperties.indexOf(sp.imported.name) !== -1
          )
          .map(sp => sp.imported.name);

        const importDeclaration = findImportPath(name, path);
        const specifiers = [];

        // if ReactDOM needs to be in scope and it's not declared, or we're going to
        // replace its declaration to add import specifiers...
        if (uses > 0 && (!domAlreadyDeclared || importDeclaration.length > 0)) {
          specifiers.push(j.importDefaultSpecifier(j.identifier(name)));
        }
        if (usedProperties.length > 0) {
          j(coreImportDeclaration)
            .find(j.ImportSpecifier)
            .filter(p => usedProperties.indexOf(p.value.local.name) !== -1)
            .remove();
          specifiers.push(
            ...usedProperties.map(prop => j.importSpecifier(j.identifier(prop)))
          );
        }
        if (specifiers.length > 0) {
          if (importDeclaration.length > 0) {
            importDeclaration.replaceWith(
              j.importDeclaration(specifiers, j.literal(path))
            );
          } else {
            coreImportDeclaration.insertAfter(
              j.importDeclaration(specifiers, j.literal(path))
            );
          }
        }
      }

      emitImport('ReactDOM', domModuleName, DOM_PROPERTIES, domUses);
      emitImport(
        'ReactDOMServer',
        domServerModuleName,
        DOM_SERVER_PROPERTIES,
        domServerUses
      );

      const coreImportSpecifiers = j(coreImportDeclaration).find(
        j.ImportSpecifier
      );
      if (coreImportSpecifiers.length === 0 && coreUses === 0) {
        j(coreImportDeclaration).remove();
      } else if (coreImportSpecifiers.length > 0 && coreUses === 0) {
        j(coreImportDeclaration)
          .find(j.ImportDefaultSpecifier)
          .remove();
      }
    }
  });

  return root.toSource(printOptions);
};
