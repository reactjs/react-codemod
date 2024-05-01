
'use strict';

const tests = [
  'use-context',
  'use-context-2', 
  'any-use-context'
];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('use-context-hook', () => {

  tests.forEach(test =>
    defineTest(
      __dirname,
      'use-context-hook',
      null,
      `use-context-hook/${ test }`
    )
  );


  describe('typescript', () => {

    beforeEach(() => {
      jest.mock('../use-context-hook', () => {
        return Object.assign(
          require.requireActual('../use-context-hook'),
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
        'use-context-hook',
        null,
        `use-context-hook/typescript/${ test }`
      );
    });
    
  });
});
