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

  const root = j(fileInfo.source);

  const propertyComparator = (a, b) => {
    const nameA = a.key.name;
    const nameB = b.key.name;

    const indexA = getRefPropIndexes(a);
    const indexB = getRefPropIndexes(b);

    const sameLocation = indexA.length == 1 && indexB.length == 1 && indexA[0] == indexB[0];

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
const methodsOrder = [
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

// Code below from
// https://github.com/yannickcr/eslint-plugin-react/blob/master/lib/rules/sort-comp.js

const regExpRegExp = /\/(.*)\/([g|y|i|m]*)/;

/**
 * Get indexes of the matching patterns in methods order configuration
 * @param {Object} method
 * @returns {Array} The matching patterns indexes. Return [Infinity] if there is no match.
 */
function getRefPropIndexes(method) {
  const methodName = method.key.name;
  const selectorCount = methodsOrder.length;
  const indexes = [];

  for (let i = 0; i < selectorCount; i++) {
    const selector = methodsOrder[i];
    let matching;

    if (methodName === selector) {
      matching = true;
    } else if (method.static) {
      matching = selector === 'static-methods';
    } else {
      const isRegExp = selector.match(regExpRegExp);
      matching = isRegExp && (new RegExp(selector)).test(methodName);
    }

    if (matching) {
      indexes.push(i);
    }
  }

  // No matching pattern, return 'everything-else' index
  if (indexes.length === 0) {
    for (let i = 0; i < selectorCount; i++) {
      const selector = methodsOrder[i];
      if (selector === 'everything-else') {
        indexes.push(i);
      }
    }
  }

  // No matching pattern and no 'everything-else' group
  if (indexes.length === 0) {
    indexes.push(Infinity);
  }

  return indexes;
}
