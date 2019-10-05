/* eslint-env jest */

/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree. 
 *
 */

// todo - tests for class, pure-component, pure-render-mixin sub options

let gitStatusReturnValue;
let execaReturnValue;

jest.setMock('execa', {
  sync: () => execaReturnValue
});

jest.setMock('is-git-clean', {
  sync: () => {
    if (typeof gitStatusReturnValue === 'boolean') {
      return gitStatusReturnValue;
    }
    throw gitStatusReturnValue;
  }
});

const fs = require('fs');
const path = require('path');
const {
  runTransform,
  jscodeshiftExecutable,
  transformerDirectory
} = require('../cli');

const checkGitStatus = require('../cli').checkGitStatus;

describe('check-git-status', () => {
  it('does not exit and output any logs when git repo is clean', () => {
    gitStatusReturnValue = true;
    console.log = jest.fn();
    process.exit = jest.fn();
    checkGitStatus();
    expect(console.log).not.toBeCalled();
    expect(process.exit).not.toBeCalled();
  });

  it('does not exit and output any logs when not a git repo', () => {
    const err = new Error();
    err.stderr = 'Not a git repository';
    gitStatusReturnValue = err;
    console.log = jest.fn();
    process.exit = jest.fn();
    checkGitStatus();
    expect(console.log).not.toBeCalled();
    expect(process.exit).not.toBeCalled();
  });

  it('exits and output logs when git repo is dirty', () => {
    gitStatusReturnValue = false;
    console.log = jest.fn();
    process.exit = jest.fn();
    checkGitStatus();
    expect(console.log).toBeCalled();
    expect(process.exit).toBeCalled();
  });

  it('exits and output logs when git detection fail', () => {
    gitStatusReturnValue = new Error('bum');
    console.log = jest.fn();
    process.exit = jest.fn();
    checkGitStatus();
    expect(console.log).toBeCalled();
    expect(process.exit).toBeCalled();
  });

  it('does not exit when git repo is dirty and force flag is given', () => {
    gitStatusReturnValue = false;
    console.log = jest.fn();
    process.exit = jest.fn();
    checkGitStatus(true);
    expect(console.log).toBeCalledWith(
      'WARNING: Git directory is not clean. Forcibly continuing.'
    );
    expect(process.exit).not.toBeCalled();
  });
});

describe('runTransform', () => {
  it('finds transformer directory', () => {
    fs.lstatSync(transformerDirectory);
  });

  it('finds jscodeshift executable', () => {
    fs.lstatSync(jscodeshiftExecutable);
  });

  it('runs jscodeshift for the given transformer', () => {
    execaReturnValue = { error: null };
    console.log = jest.fn();
    runTransform({
      files: 'src',
      flags: {},
      parser: 'flow',
      transformer: 'rename-unsafe-xyz'
    });
    expect(console.log).toBeCalledWith(
      // eslint-disable-next-line max-len
      `Executing command: jscodeshift --verbose=2 --ignore-pattern=**/node_modules/** --parser flow --extensions=jsx,js --transform ${path.join(
        transformerDirectory,
        'rename-unsafe-xyz.js'
      )} src`
    );
  });

  it('supports jscodeshift flags', () => {
    execaReturnValue = { error: null };
    console.log = jest.fn();
    runTransform({
      files: 'folder',
      flags: { dry: true },
      parser: 'flow',
      transformer: 'rename-unsafe-lifecycles'
    });
    expect(console.log).toBeCalledWith(
      // eslint-disable-next-line max-len
      `Executing command: jscodeshift --dry --verbose=2 --ignore-pattern=**/node_modules/** --parser flow --extensions=jsx,js --transform ${path.join(
        transformerDirectory,
        'rename-unsafe-lifecycles.js'
      )} folder`
    );
  });

  it('supports typescript parser', () => {
    execaReturnValue = { error: null };
    console.log = jest.fn();
    runTransform({
      files: 'folder',
      flags: { dry: true },
      parser: 'tsx',
      transformer: 'rename-unsafe-lifecycles'
    });
    expect(console.log).toBeCalledWith(
      // eslint-disable-next-line max-len
      `Executing command: jscodeshift --dry --verbose=2 --ignore-pattern=**/node_modules/** --parser tsx --extensions=tsx,ts,jsx,js --transform ${path.join(
        transformerDirectory,
        'rename-unsafe-lifecycles.js'
      )} folder`
    );
  });

  it('supports jscodeshift custom arguments', () => {
    execaReturnValue = { error: null };
    console.log = jest.fn();
    runTransform({
      files: 'folder',
      flags: {
        dry: true,
        jscodeshift: 'verbose=2 --printOptions=\'{"quote":"double"}\''
      },
      parser: 'babel',
      transformer: 'rename-unsafe-lifecycles'
    });
    expect(console.log).toBeCalledWith(
      // eslint-disable-next-line max-len
      `Executing command: jscodeshift --dry --verbose=2 --ignore-pattern=**/node_modules/** --parser babel --extensions=jsx,js --transform ${path.join(
        transformerDirectory,
        'rename-unsafe-lifecycles.js'
      )} verbose=2 --printOptions='{"quote":"double"}' folder`
    );
  });

  it('rethrows jscodeshift errors', () => {
    const transformerError = new Error('bum');
    execaReturnValue = { error: transformerError };
    console.log = jest.fn();
    expect(() => {
      runTransform({
        files: 'src',
        flags: {},
        parser: 'flow',
        transformers: ['tape']
      });
    }).toThrowError(transformerError);
  });
});
