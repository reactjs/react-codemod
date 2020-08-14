This repository contains a collection of codemod scripts for use with
[JSCodeshift](https://github.com/facebook/jscodeshift) that help update Drift APIS.

### Usage
`npx @driftt/codemod <transform> <path> [...options]`
   * `transform` - name of transform, see available transforms below. 
   * `path` - files or directory to transform
   * use the `--dry` option for a dry-run and use `--print` to print the output for comparison

This will start an interactive wizard, and then run the specified transform. 

### Included Transforms

#### `example`

Converts calls to console.log into calls to console.warn

```sh
npx @driftt/codemod example <path>
```

### jscodeshift options

To pass more options directly to jscodeshift, use `--jscodeshift="..."`. For example:
```sh
npx @driftt/codemod --jscodeshift="--run-in-band --verbose=2"
```

See all available options [here](https://github.com/facebook/jscodeshift#usage-cli).

### Recast Options

Options to [recast](https://github.com/benjamn/recast)'s printer can be provided
through jscodeshift's `printOptions` command line argument

```sh
npx @driftt/codemod <transform> <path> --jscodeshift="--printOptions='{\"quote\":\"double\"}'"
```

#### `explicit-require=false`

If you're not explicitly importing a package in your files (eg: if you're loading a package with a script tag), you should add `--explicit-require=false`.

### Support and Contributing

The scripts in this repository are provided in the hope that they are useful,
but they are not officially maintained, and we generally will not fix
community-reported issues. They are a collection of scripts that were previously
used internally within Facebook or were contributed by the community, and we
rely on community contributions to fix any issues discovered or make any
improvements. If you want to contribute, you're welcome to submit a pull
request.

### License


@driftt/codemod is forked from [@reactjs/react-codemod](https://github.com/reactjs/react-codemod) under the [MIT license](./LICENSE).
