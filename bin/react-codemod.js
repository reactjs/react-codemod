#!/usr/bin/env node

// react-codemod name-of-transform path/to/src

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const currentDir = process.cwd();
process.chdir(__dirname);

const transforms = fs
  .readdirSync('../transforms')
  .filter(x => x.slice(-3) === '.js')
  .map(x => x.slice(0, -3));

const transform = process.argv[2];
const dest = process.argv[3];
const usage = `npx react-codemod <transform> <path/to/code>\n`;
if (!transform || transforms.indexOf(transform) === -1) {
  console.log(usage);
  console.error(
    'missing/invalid transform name. Pick one of:\n' +
      transforms.map(x => '- ' + x).join('\n')
  );
  process.exit(1);
}
if (!dest) {
  console.log(usage);
  console.error('missing path to code.');
  process.exit(1);
}

const cmd = `npm run jscodeshift -- -t ${path.join(
  'transforms',
  transform + '.js'
)} ${path.join(
  currentDir,
  dest
)} --verbose=2 --ignore-pattern= node_modules ${[...process.argv]
  .slice(4)
  .join(' ')}`;
console.log('running', cmd);
childProcess.execSync(cmd);