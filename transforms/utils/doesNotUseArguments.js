/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

module.exports = function(j) {
  const ReactUtils = require('./ReactUtils')(j);

  const doesNotUseArguments = (path, filepath) => {
    const hasArguments =
      j(path)
        .find(j.Identifier, { name: 'arguments' })
        .size() > 0;

    if (hasArguments) {
      var warnStr = '';

      if (filepath) {
        warnStr += filepath + ': ';
      }

      warnStr += '`' + ReactUtils.directlyGetComponentName(path) + '` ' +
        'was skipped because `arguments` was found in your functions. ' +
        'Arrow functions do not expose an `arguments` object; ' +
        'consider changing to use ES6 spread operator and re-run this script.';

      console.warn(warnStr);

      return false;
    }
    return true;
  };

  return doesNotUseArguments;
};
