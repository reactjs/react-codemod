/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

function getDOMNodeToFindDOMNode(file, api, options) {
  const j = api.jscodeshift;

  require('./utils/array-polyfills');
  const ReactUtils = require('./utils/ReactUtils')(j);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true
  };
  const root = j(file.source);

  const createReactFindDOMNodeCall = arg =>
    j.callExpression(
      j.memberExpression(
        j.identifier('React'),
        j.identifier('findDOMNode'),
        false
      ),
      [arg]
    );

  const updateRefCall = (path, refName) => {
    j(path)
      .find(j.CallExpression, {
        callee: {
          object: {
            type: 'Identifier',
            name: refName
          },
          property: {
            type: 'Identifier',
            name: 'getDOMNode'
          }
        }
      })
      .forEach(callPath =>
        j(callPath).replaceWith(
          createReactFindDOMNodeCall(j.identifier(refName))
        )
      );
  };

  const updateToFindDOMNode = classPath => {
    var sum = 0;

    // this.getDOMNode()
    sum += j(classPath)
      .find(j.CallExpression, {
        callee: {
          object: {
            type: 'ThisExpression'
          },
          property: {
            type: 'Identifier',
            name: 'getDOMNode'
          }
        }
      })
      .forEach(path =>
        j(path).replaceWith(createReactFindDOMNodeCall(j.thisExpression()))
      )
      .size();

    // this.refs.xxx.getDOMNode() or this.refs.xxx.refs.yyy.getDOMNode()
    sum += j(classPath)
      .find(j.MemberExpression, {
        object: {
          type: 'MemberExpression',
          object: {
            type: 'MemberExpression',
            object: {
              type: 'ThisExpression'
            },
            property: {
              type: 'Identifier',
              name: 'refs'
            }
          }
        }
      })
      .closest(j.CallExpression)
      .filter(
        path =>
          path.value.callee.property &&
          path.value.callee.property.type === 'Identifier' &&
          path.value.callee.property.name === 'getDOMNode'
      )
      .forEach(path =>
        j(path).replaceWith(
          createReactFindDOMNodeCall(path.value.callee.object)
        )
      )
      .size();

    // someVariable.getDOMNode() wherre `someVariable = this.refs.xxx`
    sum += j(classPath)
      .findVariableDeclarators()
      .filter(path => {
        const init = path.value.init;
        const value = init && init.object;
        return (
          value &&
          value.type === 'MemberExpression' &&
          value.object &&
          value.object.type === 'ThisExpression' &&
          value.property &&
          value.property.type === 'Identifier' &&
          value.property.name === 'refs' &&
          init.property &&
          init.property.type === 'Identifier'
        );
      })
      .forEach(path =>
        j(path)
          .closest(j.FunctionExpression)
          .forEach(fnPath => updateRefCall(fnPath, path.value.id.name))
      )
      .size();

    return sum > 0;
  };

  if (options['explicit-require'] === false || ReactUtils.hasReact(root)) {
    const apply = path => path.filter(updateToFindDOMNode);

    const didTransform =
      apply(ReactUtils.findReactCreateClass(root)).size() +
        apply(ReactUtils.findReactCreateClassModuleExports(root)).size() +
        apply(ReactUtils.findReactCreateClassExportDefault(root)).size() >
      0;

    if (didTransform) {
      return root.toSource(printOptions);
    }
  }

  return null;
}

module.exports = getDOMNodeToFindDOMNode;
