/**
 * Reorders React component methods to match the [ESLint](http://eslint.org/)
 * [react/sort-comp rule](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md),
 * specifically with the [tighter constraints of the Airbnb style guide](https://github.com/airbnb/javascript/blob/6c89f9587f96688bf0d4d536adb8eb4ed9bf0002/packages/eslint-config-airbnb/rules/react.js#L47-L57),
 *
 *  'react/sort-comp': [2, {
 *    'order': [
 *      'lifecycle',
 *      '/^on.+$/',
 *      '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
 *      'everything-else',
 *      '/^render.+$/',
 *      'render'
 *    ]
 *  }],
 *
 * NOTE: only works on React.createClass() syntax, not ES6 class.
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

    const indexA = getRefPropIndexes(nameA);
    const indexB = getRefPropIndexes(nameB);

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

  if (
    options['explicit-require'] === false ||
    ReactUtils.hasReact(root)
  ) {
    const sortCandidates = ReactUtils.findReactCreateClass(root);

    if (sortCandidates.size() > 0) {
      sortCandidates.forEach(sortComponentProperties);
      return root.toSource(printOptions);
    }
  }

  return null;
};

// Hard-coded for Airbnb style
const methodsOrder = [
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
 * @param {String} method - Method name.
 * @returns {Array} The matching patterns indexes. Return [Infinity] if there is no match.
 */
function getRefPropIndexes(method) {
  var isRegExp;
  var matching;
  var i;
  var j;
  var indexes = [];
  for (i = 0, j = methodsOrder.length; i < j; i++) {
    isRegExp = methodsOrder[i].match(regExpRegExp);
    if (isRegExp) {
      matching = new RegExp(isRegExp[1], isRegExp[2]).test(method);
    } else {
      matching = methodsOrder[i] === method;
    }
    if (matching) {
      indexes.push(i);
    }
  }

  // No matching pattern, return 'everything-else' index
  if (indexes.length === 0) {
    for (i = 0, j = methodsOrder.length; i < j; i++) {
      if (methodsOrder[i] === 'everything-else') {
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
