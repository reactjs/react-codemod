## React Codemods [![Build Status](https://travis-ci.org/reactjs/react-codemod.svg)](https://travis-ci.org/reactjs/react-codemod)

This repository contains a collection of codemods to help update React apps.

All codemods, whether you use the `codemod` CLI command or `react-codemod`, are free and open source, with the source code available in this repository.

### Usage

We recommend using the [`codemod`](https://go.codemod.com/github) command for an enhanced experience and better support.

`npx codemod <framework>/<version>/<transform> --target <path> [...options]`
* `transform` - name of transform, see available transforms below.
* `path` - directory to transform

Check [codemod docs](https://go.codemod.com/cli-docs) for the full list of available commands.

For the legacy `react-codemod` command, see [LEGACY.md](https://github.com/reactjs/react-codemod/blob/master/LEGACY.md).

## Available Codemods

All React codemods are also available in the [Codemod Registry](https://go.codemod.com/react-codemods).

#### `remove-context-provider`

Converts `Context.Provider` JSX opening and closing elements into `Context`.

```sh
npx codemod react/19/remove-context-provider --target <path>
```

#### `remove-forward-ref`

Removes usages of `forwardRef`.

```sh
npx codemod react/19/remove-forward-ref --target <path>
```

#### `use-context-hook`

Replaces usages of `React.useContext(...)` with `React.use(...)`.

```sh
npx codemod react/19/use-context-hook --target <path>
```

#### `replace-act-import`

Updates `act` import path from `react-dom/test-utils` to `react`.

```sh
npx codemod react/19/replace-act-import --target <path>
```

#### `replace-string-ref`

Replaces deprecated string refs with callback refs.

```sh
npx codemod react/19/replace-string-ref --target <path>
```

#### `replace-use-form-state`

Replaces usages of useFormState() to use useActionState().

```sh
npx codemod react/19/replace-use-form-state --target <path>
```

#### `replace-reactdom-render`

Replaces usages of ReactDom.render() with createRoot(node).render().

```sh
npx codemod react/19/replace-reactdom-render --target <path>
```

#### `create-element-to-jsx`

Converts calls to `React.createElement` into JSX elements.

```sh
npx codemod react/create-element-to-jsx --target <path>
```

#### `error-boundaries`

Renames the experimental `unstable_handleError` lifecycle hook to `componentDidCatch`.

```sh
npx codemod react/error-boundaries --target <path>
```

#### `findDOMNode`

Updates `this.getDOMNode()` or `this.refs.foo.getDOMNode()` calls inside of
`React.createClass` components to `React.findDOMNode(foo)`. Note that it will
only look at code inside of `React.createClass` calls and only update calls on
the component instance or its refs. You can use this script to update most calls
to `getDOMNode` and then manually go through the remaining calls.

```sh
npx codemod react/findDOMNode --target <path>
```

#### `manual-bind-to-arrow`

Converts manual function bindings in a class (e.g., `this.f = this.f.bind(this)`) to arrow property initializer functions (e.g., `f = () => {}`).

```sh
npx codemod react/manual-bind-to-arrow --target <path>
```

#### `pure-component`

Converts ES6 classes that only have a render method, only have safe properties
(statics and props), and do not have refs to Functional Components.

The wizard will ask for 2 options -

* **Use arrow functions?**: converts to arrow function. Converts to `function` by default.
* **Destructure props?**: will destructure props in the argument where it is safe to do so.

```sh
npx codemod react/pure-component --target <path>
```

#### `pure-render-mixin`

Removes `PureRenderMixin` and inlines `shouldComponentUpdate` so that the ES2015
class transform can pick up the React component and turn it into an ES2015
class. NOTE: This currently only works if you are using the master version
(>0.13.1) of React as it is using `React.addons.shallowCompare`

```sh
npx codemod react/pure-render-mixin --target <path>
```

  * The wizard will ask to optionally override `mixin-name`, and look for it
   instead of `PureRenderMixin`. Note that it is not possible to use a
   namespaced name for the mixin. `mixins: [React.addons.PureRenderMixin]` will
   not currently work.

#### `React-PropTypes-to-prop-types`

Replaces `React.PropTypes` references with `prop-types` and adds the appropriate `import` or `require` statement. This codemod is intended for React 15.5+.

```sh
npx codemod react/React-PropTypes-to-prop-types --target <path>
```

  * In addition to running the above codemod you will also need to install the `prop-types` NPM package.

#### `rename-unsafe-lifecycles`

Adds `UNSAFE_` prefix for deprecated lifecycle hooks. (For more information about this codemod, see [React RFC #6](https://github.com/reactjs/rfcs/pull/6))

```sh
npx codemod react/rename-unsafe-lifecycles --target <path>
```

#### `react-to-react-dom`

Updates code for the split of the `react` and `react-dom` packages (e.g.,
`React.render` to `ReactDOM.render`). It looks for `require('react')` and
replaces the appropriate property accesses using `require('react-dom')`. It does
not support ES6 modules or other non-CommonJS systems. We recommend performing
the `findDOMNode` conversion first.

```sh
npx codemod react/react-to-react-dom --target <path>
```

  * After running the automated codemod, you may want to run a regex-based
    find-and-replace to remove extra whitespace between the added requires, such
    as `codemod.py -m -d src --extensions js '(var
    React\s*=\s*require\(.react.\);)\n\n(\s*var ReactDOM)' '\1\n\2'` using
    https://github.com/facebook/codemod.

#### `React-DOM-to-react-dom-factories`

Converts calls like `React.DOM.div(...)` to `React.createElement('div', ...)`.

```sh
npx codemod react/React-DOM-to-react-dom-factories --target <path>
```

#### `ReactNative-View-propTypes`

Replaces `View.propTypes` references with `ViewPropTypes` and adds the appropriate `import` or `require` statement. This codemod is intended for ReactNative 44+.

```sh
npx codemod react/ReactNative-View-propTypes --target <path>
```

#### `string-refs`

WARNING: Only apply this codemod if you've fixed all warnings like this:

```
Warning: Component "div" contains the string ref "inner". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. 
```

This codemod will convert deprecated string refs to callback refs.

Input:

```jsx
import * as React from "react";

class ParentComponent extends React.Component {
  render() {
    return <div ref="refComponent" />;
  }
}
```

Output:

```jsx
import * as React from "react";

class ParentComponent extends React.Component {
  render() {
    return (
      <div
        ref={(current) => {
          this.refs["refComponent"] = current;
        }}
      />
    );
  }
}
```

Note that this only works for string literals.
Referring to the ref with a variable will not trigger the transform:
Input:

```jsx
import * as React from "react";

const refName = "refComponent";

class ParentComponent extends React.Component {
  render() {
    return <div ref={refName} />;
  }
}
```

Output (nothing changed):

```jsx
import * as React from "react";

const refName = "refComponent";

class ParentComponent extends React.Component {
  render() {
    return <div ref={refName} />;
  }
}
```

#### `update-react-imports`

[As of Babel 7.9.0](https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154-https-githubcom-babel-babel-pull-11154), when using `runtime: automatic` in `@babel/preset-react` or `@babel/plugin-transform-react-jsx`, you will not need to explicitly import React for compiling jsx. This codemod removes the redundant import statements. It also converts default imports (`import React from 'react'`) to named imports (e.g. `import { useState } from 'react'`).

The wizard will ask for 1 option -

* **Destructure namespace imports as well?**: If chosen, *namespace* imports like `import * as React` will *also* be converted. By default, it's false, so only default imports (`import React`) are converted.

```sh
npx codemod react/update-react-imports --target <path>
```

## Support and Contributing

The scripts in this repository are maintained by the React team in collaboration with the [Codemod.com](https://codemod.com) team.

If you want to contribute, you're welcome to submit a pull request.

## License

react-codemod is [MIT licensed](./LICENSE).
