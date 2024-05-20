

'use strict';

const tests = [
  'default-import', 
  'named-import-2', 
  'named-import-3', 
  'named-import', 
  'other-import', 
  'wildcard-import'
];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('replace-use-form-state', () => {

  tests.forEach(test =>
    defineTest(
      __dirname,
      'replace-use-form-state',
      null,
      `replace-use-form-state/${ test }`
    )
  );

});
