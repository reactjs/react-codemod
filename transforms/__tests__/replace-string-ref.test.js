

'use strict';

const tests = [
  'class-component-custom-import-names',
  'class-component-default-import', 
  'class-component-named-import', 
  'function-component', 
];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('replace-string-ref', () => {

  tests.forEach(test =>
    defineTest(
      __dirname,
      'replace-string-ref',
      null,
      `replace-string-ref/${ test }`
    )
  );

});
