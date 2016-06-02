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

/**
 * Reorders React component methods to match the [ESLint](http://eslint.org/)
 * [react/sort-comp rule](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md),
 * specifically with the [tighter constraints of the Airbnb style guide](https://github.com/airbnb/javascript/blob/7684892951ef663e1c4e62ad57d662e9b2748b9e/packages/eslint-config-airbnb/rules/react.js#L122-L134),
 *
 *  'react/sort-comp': [2, {
 *    'order': [
 *      'static-methods',
 *      'lifecycle',
 *      '/^on.+$/',
 *      '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
 *      'everything-else',
 *      '/^render.+$/',
 *      'render'
 *    ]
 *  }],
 */

module.exports = function(fileInfo, api, options) {
  const j = api.jscodeshift;

  const ReactUtils = require('./utils/ReactUtils')(j);

  const printOptions =
    options.printOptions || {quote: 'single', trailingComma: true};

  const methodsOrder = getMethodsOrder(fileInfo, options);

  const root = j(fileInfo.source);

  const propertyComparator = (a, b) => {
    const nameA = a.key.name;
    const nameB = b.key.name;

    const indexA = getCorrectIndex(methodsOrder, a);
    const indexB = getCorrectIndex(methodsOrder, b);

    const sameLocation = indexA === indexB;

    if (sameLocation) {
      // compare lexically
      return +(nameA > nameB) || +(nameA === nameB) - 1;
    } else {
      // compare by index
      return indexA - indexB;
    }
  };

  const sortComponentProperties = classPath => {
    const spec = ReactUtils.getReactCreateClassSpec(classPath);

    if (spec) {
      spec.properties.sort(propertyComparator);
    }
  };

  const sortClassProperties = classPath => {
    const spec = ReactUtils.getClassExtendReactSpec(classPath);

    if (spec) {
      spec.body.sort(propertyComparator);
    }
  };

  if (
    options['explicit-require'] === false ||
    ReactUtils.hasReact(root)
  ) {
    const createClassSortCandidates = ReactUtils.findReactCreateClass(root);
    const es6ClassSortCandidates = ReactUtils.findReactES6ClassDeclaration(root);

    if (createClassSortCandidates.size() > 0) {
      createClassSortCandidates.forEach(sortComponentProperties);
    }

    if (es6ClassSortCandidates.size() > 0) {
      es6ClassSortCandidates.forEach(sortClassProperties);
    }

    if (
      createClassSortCandidates.size() > 0 ||
      es6ClassSortCandidates.size() > 0
    ) {
      return root.toSource(printOptions);
    }
  }

  return null;
};

// Hard-coded for Airbnb style
const defaultMethodsOrder = [
  'static-methods',
  'displayName',
  'propTypes',
  'contextTypes',
  'childContextTypes',
  'mixins',
  'statics',
  'defaultProps',
  'constructor',
  'getDefaultProps',
  'state',
  'getInitialState',
  'getChildContext',
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
  '/^on.+$/',
  '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
  'everything-else',
  '/^render.+$/',
  'render',
];

// FROM https://github.com/yannickcr/eslint-plugin-react/blob/master/lib/rules/sort-comp.js
const regExpRegExp = /\/(.*)\/([g|y|i|m]*)/;

function selectorMatches(selector, method) {
  if (method.static && selector === 'static-methods') {
    return true;
  }

  const methodName = method.key.name;

  if (selector === methodName) {
    return true;
  }

  const selectorIsRe = regExpRegExp.test(selector);

  if (selectorIsRe) {
    const selectorRe = new RegExp(selector);
    return selectorRe.test(methodName);
  }

  return false;
}

/**
 * Get index of the matching patterns in methods order configuration
 * @param {Object} method
 * @returns {Number} Index of the method in the method ordering. Return [Infinity] if there is no match.
 */
function getCorrectIndex(methodsOrder, method) {
  const everythingElseIndex = methodsOrder.indexOf('everything-else');

  for (let i = 0; i < methodsOrder.length; i++) {
    if (i != everythingElseIndex && selectorMatches(methodsOrder[i], method)) {
      return i;
    }
  }

  if (everythingElseIndex >= 0) {
    return everythingElseIndex;
  } else {
    return Infinity;
  }
}

function getMethodsOrderFromEslint(filePath) {
  let order;
  const CLIEngine = require('eslint').CLIEngine;
  const cli = new CLIEngine({ useEslintrc: true });
  try {
    const config = cli.getConfigForFile(filePath);
    const {rules} = config;
    const sortCompRules = rules['react/sort-comp'];
    order = sortCompRules && sortCompRules[1].order;
  } catch (e) {
    // unable to get config for file
  }
  return order;
}

function getMethodsOrder(fileInfo, options) {
  return options.methodsOrder
    || getMethodsOrderFromEslint(fileInfo.path)
    || defaultMethodsOrder;
}
