

'use strict';

const tests = [
  'default',
  'nested', 
];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('replace-reactdom-render', () => {

  tests.forEach(test =>
    defineTest(
      __dirname,
      'replace-reactdom-render',
      null,
      `replace-reactdom-render/${ test }`
    )
  );
});
