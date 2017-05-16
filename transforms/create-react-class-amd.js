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

const MODULE_NAME = 'create-react-class';
const MODULE_VARIABLE_NAME = 'createReactClass';

const replaceReactCreateClassReferences = (j, root) => {
  let hasModifications = false;

  root
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        object: {type: 'Identifier', name: 'React'},
        property: {type: 'Identifier', name: 'createClass'}
      }})
    .forEach(path => {
      hasModifications = true;
      path.value.callee = j.identifier(MODULE_VARIABLE_NAME);
    });

  return hasModifications;
};

const getAMDDefineExpression = (j, root) => {
  return root
    .find(j.CallExpression, {
      callee: {type: 'Identifier', name: 'define'},
      arguments: [{type: 'ArrayExpression'}, {type: 'FunctionExpression'}]
    })
    .paths()[0];
};

const removeEmptyReactImport = (j, root) => {
  const defineExpression = getAMDDefineExpression(j, root);
  if (defineExpression) {
    const isReactInUse = root.find(j.MemberExpression, {object: {name: 'React'}}).length > 0;
    if (!isReactInUse) {
      const [modules, aliases] = defineExpression.value.arguments;
      modules.elements = modules.elements.filter(node => node.value !== 'react');
      aliases.params = aliases.params.filter(node => node.name !== 'React');
    }
  }
};

const addCreateReactClassImport = (j, root) => {
  const defineExpression = getAMDDefineExpression(j, root);
  if (defineExpression) {
    const [modules, aliases] = defineExpression.value.arguments;
    modules.elements.unshift(j.literal(MODULE_NAME));
    aliases.params.unshift(j.identifier(MODULE_VARIABLE_NAME));
    return;
  }

  throw new Error('No create-react-class import found!');
};

module.exports = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  let hasModifications = false;
  hasModifications = replaceReactCreateClassReferences(j, root) || hasModifications;

  if (hasModifications) {
    addCreateReactClassImport(j, root);
    removeEmptyReactImport(j, root);
  }

  return hasModifications
    ? root.toSource({ quote: 'single' })
    : null;
};