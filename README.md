## Codemods for NFL Migration

This repository contains a collection of codemod scripts based for use with
[JSCodeshift](https://github.com/facebook/jscodeshift) that helps with Gridiron Migration

### Setup & Run

  * `npm install -g jscodeshift`
  * `jscodeshift -t <codemod-script> <file>`
  * Use the `-d` option for a dry-run and use `-p` to print the output
    for comparison

### Included Scripts
  * `convert-ad`, `convert-helmet-import`, `remove-gridiron-import`, `convert-prefetch` - import helpers
  * `convert-to-radium`, `remove-stilr` - convert from stilr to radium
  * `resolve-relative-imports` - Convert to JSPM Imports

### Recast Options

Options to [recast](https://github.com/benjamn/recast)'s printer can be provided
through the `printOptions` command line argument

 * `jscodeshift -t transform.js <file> --printOptions='{"quote":"double"}'`

 ### Credit

 This repo is based off of [reactjs-codemod](https://github.com/reactjs/react-codemod).
 Thank you [@reactjs](https://twitter.com/reactjs) and [@fbOpenSource](https://twitter.com/fbopensource)!
