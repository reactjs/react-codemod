## react-codemod [![Build Status](https://travis-ci.org/reactjs/react-codemod.svg)](https://travis-ci.org/reactjs/react-codemod)

This repository contains a collection of codemod scripts based for use with
[JSCodeshift](https://github.com/facebook/jscodeshift) that help update React
APIs.

### Setup & Run

  * `npm install -g jscodeshift`
  * `git clone https://github.com/reactjs/react-codemod.git` or download a zip file
    from `https://github.com/reactjs/react-codemod/archive/master.zip`
  * `jscodeshift -t <codemod-script> <path>`
  * Use the `-d` option for a dry-run and use `-p` to print the output
    for comparison

### Included Scripts

#### `class`

Transforms `React.createClass` calls into ES2015 classes.

```sh
jscodeshift -t react-codemod/transforms/class.js <path>
```

  * If `--no-super-class` is specified it will not extend
    `React.Component` if `setState` and `forceUpdate` aren't being called in a
    class. We do recommend always extending from `React.Component`, especially
    if you are using or planning to use [Flow](http://flowtype.org/). Also make
    sure you are not calling `setState` anywhere outside of your component.

#### `create-element-to-jsx`

Converts calls to `React.createElement` into JSX elements.

```sh
jscodeshift -t react-codemod/transforms/create-element-to-jsx.js <path>
```

#### `findDOMNode`

Updates `this.getDOMNode()` or `this.refs.foo.getDOMNode()` calls inside of
`React.createClass` components to `React.findDOMNode(foo)`. Note that it will
only look at code inside of `React.createClass` calls and only update calls on
the component instance or its refs. You can use this script to update most calls
to `getDOMNode` and then manually go through the remaining calls.

```sh
jscodeshift -t react-codemod/transforms/findDOMNode.js <path>
```

#### `pure-component`

```sh
jscodeshift -t react-codemod/transforms/pure-component.js <path>
```

#### `pure-render-mixin`

Removes `PureRenderMixin` and inlines `shouldComponentUpdate` so that the ES2015
class transform can pick up the React component and turn it into an ES2015
class. NOTE: This currently only works if you are using the master version
(>0.13.1) of React as it is using `React.addons.shallowCompare`

```sh
jscodeshift -t react-codemod/transforms/pure-render-mixin.js <path>
```

 * If `--mixin-name=<name>` is specified it will look for the specified name
   instead of `PureRenderMixin`. Note that it is not possible to use a
   namespaced name for the mixin. `mixins: [React.addons.PureRenderMixin]` will
   not currently work.

#### `react-to-react-dom`

Updates code for the split of the `react` and `react-dom` packages (e.g.,
`React.render` to `ReactDOM.render`). It looks for `require('react')` and
replaces the appropriate property accesses using `require('react-dom')`. It does
not support ES6 modules or other non-CommonJS systems. We recommend performing
the `findDOMNode` conversion first.

```sh
jscodeshift -t react-codemod/transforms/react-to-react-dom.js <path>
```

  * After running the automated codemod, you may want to run a regex-based
    find-and-replace to remove extra whitespace between the added requires, such
    as `codemod.py -m -d src --extensions js '(var
    React\s*=\s*require\(.react.\);)\n\n(\s*var ReactDOM)' '\1\n\2'` using
    https://github.com/facebook/codemod.

#### `sort-comp`

Reorders React component methods to match the [ESLint](http://eslint.org/)
[react/sort-comp
rule](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md),
specifically with the [tighter constraints of the Airbnb style
guide](https://github.com/airbnb/javascript/blob/7684892951ef663e1c4e62ad57d662e9b2748b9e/packages/eslint-config-airbnb/rules/react.js#L122-L134).

```sh
jscodeshift -t react-codemod/transforms/sort-comp.js <path>
```

#### `append-px-to-style-properties`

Updates code to get rid of warnings in React 15 when using shorthand style syntax in string without `px`. Future versions of React will not automatically append `px` to the end of values specified with shorthand inside string. Optionally you can pass comma delimited values to `ignore` on the command line for style properties you want to specifically not transform. By default will only transform string values with `px` suffix but you can optionally pass in `transformNumbers=true` on the command line to also transform number values to string with `px` suffix.

```sh
jscodeshift -t react-codemod/transforms/react-to-react-dom.js <path>
jscodeshift -t react-codemod/transforms/react-to-react-dom.js --ignore='fontSize,height' <path>
jscodeshift -t react-codemod/transforms/react-to-react-dom.js --transformNumbers=true <path>
```

### Explanation of the ES2015 class transform

  * Ignore components with calls to deprecated APIs. This is very defensive, if
    the script finds any identifiers called `isMounted`, `getDOMNode`,
    `replaceProps`, `replaceState` or `setProps` it will skip the component.
  * Replaces `var A = React.createClass(spec)` with
    `class A (extends React.Component) {spec}`.
  * Pulls out all statics defined on `statics` plus the few special cased
    statics like `propTypes`, `childContextTypes`, `contextTypes` and
    `displayName` and assigns them after the class is created.
    `class A {}; A.foo = bar;`
  * Takes `getDefaultProps` and inlines it as a static `defaultProps`.
    If `getDefaultProps` is defined as a function with a single statement that
    returns an object, it optimizes and transforms
    `getDefaultProps() { return {foo: 'bar'}; }` into
    `A.defaultProps = {foo: 'bar'};`. If `getDefaultProps` contains more than
    one statement it will transform into a self-invoking function like this:
    `A.defaultProps = function() {…}();`. Note that this means that the function
    will be executed only a single time per app-lifetime. In practice this
    hasn't caused any issues – `getDefaultProps` should not contain any
    side-effects.
  * Binds class methods to the instance if methods are referenced without being
    called directly. It checks for `this.foo` but also traces variable
    assignments like `var self = this; self.foo`. It does not bind functions
    from the React API and ignores functions that are being called directly
    (unless it is both called directly and passed around to somewhere else)
  * Creates a constructor if necessary. This is necessary if either
    `getInitialState` exists in the `React.createClass` spec OR if functions
    need to be bound to the instance.
  * When `--no-super-class` is passed it only optionally extends
    `React.Component` when `setState` or `forceUpdate` are used within the
    class.

The constructor logic is as follows:

  * Call `super(props, context)` if the base class needs to be extended.
  * Bind all functions that are passed around,
    like `this.foo = this.foo.bind(this)`
  * Inline `getInitialState` (and remove `getInitialState` from the spec). It
    also updates access of `this.props.foo` to `props.foo` and adds `props` as
    argument to the constructor. This is necessary in the case when the base
    class does not need to be extended where `this.props` will only be set by
    React after the constructor has been run.
  * Changes `return StateObject` from `getInitialState` to assign `this.state`
    directly.

### Recast Options

Options to [recast](https://github.com/benjamn/recast)'s printer can be provided
through the `printOptions` command line argument

```sh
jscodeshift -t transform.js <path> --printOptions='{"quote":"double"}'
```
