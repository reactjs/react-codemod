

'use strict';

const tests = [
  'default-import', 
  'named-import-2', 
  'named-import', 
  'other-import', 
  'wildcard-import',
  'wildcard-import-2'
];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('replace-act-import', () => {

  tests.forEach(test =>
    defineTest(
      __dirname,
      'replace-act-import',
      null,
      `replace-act-import/${ test }`
    )
  );

});
