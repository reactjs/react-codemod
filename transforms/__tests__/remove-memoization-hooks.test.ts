
'use strict';

const tests = [
  'use-callback', 
  'use-memo', 
  'memo',
  'memoization-hooks'
];



const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('remove-memoization-hooks', () => {

  tests.forEach(test =>
    defineTest(
      __dirname,
      'remove-memoization-hooks',
      null,
      `remove-memoization-hooks/${ test }`
    )
  );


  describe('typescript', () => {

    beforeEach(() => {
      jest.mock('../remove-memoization-hooks', () => {
        return Object.assign(
          require.requireActual('../remove-memoization-hooks'),
          {
            parser: 'tsx'
          }
        );
      });
    });

    afterEach(() => {
      jest.resetModules();
    });

    tests.forEach(test => {
      defineTest(
        __dirname,
        'remove-memoization-hooks',
        null,
        `remove-memoization-hooks/typescript/${ test }`
      );
    });
    
  });
});
