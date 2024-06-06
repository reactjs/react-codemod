/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

/**
 * Reorders React component methods to match the [ESLint](http://eslint.org/)
 * [react/sort-comp rule](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md),
 * specifically with the [tighter constraints of the Airbnb style guide]
 * (https://github.com/airbnb/javascript/blob/eslint-config-airbnb-v19.0.4/\
 * packages/eslint-config-airbnb/rules/react.js#L243-L256),
 *
 *  'react/sort-comp': [2, {
 *    'order': [
 *      'static-variables',
 *      'static-methods',
 *      'instance-variables',
 *      'lifecycle',
 *      '/^handle.+$/',
 *      '/^on.+$/',
 *      'getters',
 *      'setters',
 *      '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
 *      'instance-methods',
 *      'everything-else',
 *      '/^render.+$/',
 *      'render'
 *    ]
 *  }],
 */

module.exports = function(fileInfo, api, options) {
  const j = api.jscodeshift;

  const ReactUtils = require('./utils/ReactUtils')(j);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true
  };

  const methodsOrder = getMethodsOrder(fileInfo, options); // eslint-disable-line no-use-before-define

  const root = j(fileInfo.source);

  const propertyComparator = (a, b) => {
    const nameA = a.key.name;
    const nameB = b.key.name;

    const indexA = getCorrectIndex(methodsOrder, a); // eslint-disable-line no-use-before-define
    const indexB = getCorrectIndex(methodsOrder, b); // eslint-disable-line no-use-before-define

    const sameLocation = indexA === indexB;

    if (sameLocation) {
      // compare lexically.
      return nameA.localeCompare(nameB);
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

  if (options['explicit-require'] === false || ReactUtils.hasReact(root)) {
    const createClassSortCandidates = ReactUtils.findReactCreateClass(root);
    const es6ClassSortCandidates = ReactUtils.findReactES6ClassDeclaration(
      root
    );

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

const REACT_LIFECYCLE_PLACEHOLDER = 'lifecycle';

const REACT_LIFECYCLE_METHODS = [
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
  'getDerivedStateFromProps',
  'componentWillMount',
  'UNSAFE_componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'UNSAFE_componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'UNSAFE_componentWillUpdate',
  'getSnapshotBeforeUpdate',
  'componentDidUpdate',
  'componentDidCatch',
  'componentWillUnmount',
];

// Hard-coded for Airbnb style
const defaultMethodsOrder = [
  'static-variables',
  'static-methods',
  'instance-variables',
  REACT_LIFECYCLE_PLACEHOLDER,
  '/^handle.+$/',
  '/^on.+$/',
  'getters',
  'setters',
  '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
  'instance-methods',
  'everything-else',
  '/^render.+$/',
  'render'
];

// FROM https://github.com/yannickcr/eslint-plugin-react/blob/master/lib/rules/sort-comp.js
const regExpRegExp = /\/(.*)\/([g|y|i|m]*)/;

function isSelectorMatchesRegexp(selector, methodName) {
  const selectorIsRe = regExpRegExp.test(selector);

  if (selectorIsRe) {
    const match = selector.match(regExpRegExp);
    const selectorRe = new RegExp(match[1], match[2]);
    return selectorRe.test(methodName);
  }

  return false;
}

function isSelectorMatchesClassDeclarations(selector, method) {
  switch (selector) {
    case 'static-variables': {
      return (
        method.static &&
        method.type === 'ClassProperty' &&
        method.value?.type !== 'ArrowFunctionExpression' &&
        method.value?.type !== 'FunctionExpression'
      );
    }
    case 'static-methods': {
      return (
        method.static &&
        (
          (method.type === 'ClassMethod' && !method.value) ||
          (method.type === 'ClassProperty' &&
            method.value?.type === 'ArrowFunctionExpression' ||
            method.value?.type === 'FunctionExpression'
          )
        )
      );
    }
    case 'type-annotations': {
      return !method.value && method.typeAnnotation;
    }
    case 'instance-variables': {
      return (
        !method.static &&
        method.type === 'ClassProperty' &&
        method.value?.type !== 'ArrowFunctionExpression'
      );
    }
    case 'instance-methods': {
      return (
        !method.static &&
        method.type === 'ClassProperty' &&
        method.value?.type === 'ArrowFunctionExpression'
      );
    }
    case 'getters': {
      return method.kind === 'get';
    }
    case 'setters': {
      return method.kind === 'set';
    }
    default: {
      return false;
    }
  }
}

/**
 * Get index of the matching patterns in methods order configuration
 * @param {String[]} methodsOrder
 * @param {Object} method
 * @returns {Number} Index of the method in the method ordering. Return [Infinity] if there is no match.
 */
function getCorrectIndex(methodsOrder, method) {
  const methodName = method.key.name;

  /*
  The same method could be matched by several criteria, say `static defaultProps = {}` can be matched
  by static-variables and exact name criteria.
  Here we introduce a priority to keep them organized.

  priority:
  1 - match by exact name, say render, constructor, defaultProps, etc.
  2 - match by regexp
  3 - match by class declarations like static-variables, instance-methods etc.
  4 - match by everything-else
  5 - Infinity
  */

  const methodIndex = methodsOrder.indexOf(methodName);
  if (methodIndex >= 0) {
    return methodIndex;
  }

  const matchedRegexpIndex = methodsOrder.findIndex(selector => isSelectorMatchesRegexp(selector, methodName));

  if (matchedRegexpIndex >= 0) {
    return matchedRegexpIndex;
  }

  const everythingElseIndex = methodsOrder.indexOf('everything-else');

  for (let i = 0; i < methodsOrder.length; i++) {
    if (i !== everythingElseIndex && isSelectorMatchesClassDeclarations(methodsOrder[i], method)) {
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
  const CLIEngine = require('eslint').CLIEngine;
  const cli = new CLIEngine({ useEslintrc: true });
  try {
    const config = cli.getConfigForFile(filePath);
    const { rules } = config;
    const sortCompRules = rules['react/sort-comp'];
    const ruleConfig = sortCompRules && sortCompRules[1];
    if (!ruleConfig) {
      return null;
    }

    const order = ruleConfig.order;
    const groups = ruleConfig.groups || {};

    let resolvedOrder = [];
    for (let i = 0; i < order.length; i++) {
      const entry = order[i];
      if (groups[entry]) {
        resolvedOrder = resolvedOrder.concat(groups[entry]);
      } else {
        resolvedOrder.push(entry);
      }
    }

    return resolvedOrder;
  } catch (e) {
    // unable to get config for file
  }
  return null;
}

function expandArray(arr, token, variants) {
  return arr.reduce((acc, item) => {
    if (item === token) {
      return [...acc, ...variants];
    }

    acc.push(item);
    return acc;
  }, []);
}

function getMethodsOrder(fileInfo, options) {
  const methodsOrders = (
    options.methodsOrder ||
    getMethodsOrderFromEslint(fileInfo.path) ||
    defaultMethodsOrder
  );

  return expandArray(methodsOrders, REACT_LIFECYCLE_PLACEHOLDER, REACT_LIFECYCLE_METHODS);
}
