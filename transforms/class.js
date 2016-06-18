/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

module.exports = (file, api, options) => {
  const j = api.jscodeshift;

  require('./utils/array-polyfills');
  const ReactUtils = require('./utils/ReactUtils')(j);

  const printOptions =
    options.printOptions || {quote: 'single', trailingComma: true};
  const root = j(file.source);

  const AUTOBIND_IGNORE_KEYS = {
    componentDidMount: true,
    componentDidUpdate: true,
    componentWillReceiveProps: true,
    componentWillMount: true,
    componentWillUpdate: true,
    componentWillUnmount: true,
    getDefaultProps: true,
    getInitialState: true,
    render: true,
    shouldComponentUpdate: true,
  };

  const DEFAULT_PROPS_FIELD = 'getDefaultProps';
  const DEFAULT_PROPS_KEY = 'defaultProps';
  const GET_INITIAL_STATE_FIELD = 'getInitialState';

  const DEPRECATED_APIS = [
    'getDOMNode',
    'isMounted',
    'replaceProps',
    'replaceState',
    'setProps',
  ];

  const PURE_MIXIN_MODULE_NAME = options['mixin-module-name'] ||
    'react-addons-pure-render-mixin';

  const STATIC_KEY = 'statics';

  const STATIC_KEYS = {
    childContextTypes: true,
    contextTypes: true,
    displayName: true,
    propTypes: true,
  };

  const MIXIN_KEY = 'mixins';

  // ---------------------------------------------------------------------------
  // Checks if the module uses mixins or accesses deprecated APIs.
  const checkDeprecatedAPICalls = classPath =>
    DEPRECATED_APIS.reduce(
      (acc, name) =>
        acc + j(classPath)
          .find(j.Identifier, {name})
          .size(),
      0
    ) > 0;

  const callsDeprecatedAPIs = classPath => {
    if (checkDeprecatedAPICalls(classPath)) {
      console.log(
        file.path + ': `' + ReactUtils.getComponentName(classPath) + '` ' +
        'was skipped because of deprecated API calls. Remove calls to ' +
        DEPRECATED_APIS.join(', ') + ' in your React component and re-run ' +
        'this script.'
      );
      return false;
    }
    return true;
  };

  const canConvertToClass = classPath => {
    const specPath = ReactUtils.getReactCreateClassSpec(classPath);
    const invalidProperties = specPath.properties.filter(prop => (
      !prop.key.name || (
        !STATIC_KEYS[prop.key.name] &&
        STATIC_KEY != prop.key.name &&
        !filterDefaultPropsField(prop) &&
        !filterGetInitialStateField(prop) &&
        !isFunctionExpression(prop) &&
        MIXIN_KEY != prop.key.name
      )
    ));

    if (invalidProperties.length) {
      const invalidText = invalidProperties
        .map(prop => prop.key.name ? prop.key.name : prop.key)
        .join(', ');
      console.log(
        file.path + ': `' + ReactUtils.getComponentName(classPath) + '` ' +
        'was skipped because of invalid field(s) `' + invalidText + '` on ' +
        'the React component. Remove any right-hand-side expressions that ' +
        'are not simple, like: `componentWillUpdate: createWillUpdate()` or ' +
        '`render: foo ? renderA : renderB`.'
      );
    }
    return !invalidProperties.length;
  };

  const areMixinsConvertible = (mixinIdentifierNames, classPath) => {
    if (
      ReactUtils.hasMixins(classPath) &&
      !ReactUtils.hasSpecificMixins(classPath, mixinIdentifierNames)
    ) {
      return false;
    }
    return true;
  };

  // ---------------------------------------------------------------------------
  // Helpers
  const createFindPropFn = prop => property => (
    property.key &&
    property.key.type === 'Identifier' &&
    property.key.name === prop
  );

  const filterDefaultPropsField = node =>
    createFindPropFn(DEFAULT_PROPS_FIELD)(node);

  const filterGetInitialStateField = node =>
    createFindPropFn(GET_INITIAL_STATE_FIELD)(node);

  const findGetInitialState = specPath =>
    specPath.properties.find(createFindPropFn(GET_INITIAL_STATE_FIELD));

  const withComments = (to, from) => {
    to.comments = from.comments;
    return to;
  };

  // ---------------------------------------------------------------------------
  // Collectors
  const isFunctionExpression = node => (
    node.key &&
    node.key.type === 'Identifier' &&
    node.value &&
    node.value.type === 'FunctionExpression'
  );

  // Collects `childContextTypes`, `contextTypes`, `displayName`, and `propTypes`;
  // simplifies `getDefaultProps` or converts it to an IIFE;
  // and collects everything else in the `statics` property object.
  const collectStatics = specPath => {
    const result = [];

    for (let i = 0; i < specPath.properties.length; i++) {
      const property = specPath.properties[i];
      if (createFindPropFn('statics')(property) && property.value && property.value.properties) {
        result.push(...property.value.properties);
      } else if (createFindPropFn(DEFAULT_PROPS_FIELD)(property)) {
        result.push(createDefaultProps(property));
      } else if (property.key && STATIC_KEYS[property.key.name]) {
        result.push(property);
      }
    }

    return result;
  };

  const collectFunctions = specPath => specPath.properties
    .filter(prop =>
      !(filterDefaultPropsField(prop) || filterGetInitialStateField(prop))
    )
    .filter(isFunctionExpression);

  const findRequirePathAndBinding = (moduleName) => {
    let result = null;

    const requireStatement = root.find(j.VariableDeclarator, {
      init: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'require',
        },
        arguments: [{
          value: moduleName,
        }],
      },
    });

    const importStatement = root.find(j.ImportDeclaration, {
      source: {
        value: moduleName,
      },
    });

    if (importStatement.size() !== 0) {
      importStatement.forEach(path => {
        result = {
          path,
          binding: path.value.specifiers[0].local.name,
        };
      });
    } else if (requireStatement.size() !== 0) {
      requireStatement.forEach(path => {
        result = {
          path,
          binding: path.value.id.name,
        };
      });
    }

    return result;
  };

  const pureRenderMixinPathAndBinding = findRequirePathAndBinding(PURE_MIXIN_MODULE_NAME);

  // ---------------------------------------------------------------------------
  // Boom!
  const createMethodDefinition = fn =>
    withComments(j.methodDefinition(
      'method',
      fn.key,
      fn.value
    ), fn);

  const isInitialStateLiftable = getInitialState => {
    if (!getInitialState || !(getInitialState.value)) {
      return true;
    } else if (!hasSingleReturnStatement(getInitialState.value)) {
      return false;
    }

    return j(getInitialState)
      .find(j.MemberExpression, {
        object: {
          type: 'ThisExpression',
        },
        property: {
          type: 'Identifier',
          name: 'props',
        },
      })
      .size() === 0;
  };

  const updatePropsAccess = getInitialState =>
    j(getInitialState)
      .find(j.MemberExpression, {
        object: {
          type: 'ThisExpression',
        },
        property: {
          type: 'Identifier',
          name: 'props',
        },
      })
      .forEach(path => j(path).replaceWith(j.identifier('props')));

  const inlineGetInitialState = getInitialState =>
    getInitialState.value.body.body.map(statement => {
      if (statement.type === 'ReturnStatement') {
        return j.expressionStatement(
          j.assignmentExpression(
            '=',
            j.memberExpression(
              j.thisExpression(),
              j.identifier('state'),
              false
            ),
            statement.argument
          )
        );
      }

      return statement;
    });

  const pickReturnValueOrCreateIIFE = value => {
    if (hasSingleReturnStatement(value)) {
      return value.body.body[0].argument;
    } else {
      return j.callExpression(
        value,
        []
      );
    }
  };

  const convertInitialStateToClassProperty = getInitialState =>
    withComments(j.classProperty(
      j.identifier('state'),
      pickReturnValueOrCreateIIFE(getInitialState.value),
      null,
      false
    ), getInitialState);

  const createConstructorArgs = () => {
    return [j.identifier('props'), j.identifier('context')];
  };

  const createConstructor = getInitialState => {
    updatePropsAccess(getInitialState);

    return [
      createMethodDefinition({
        key: j.identifier('constructor'),
        value: j.functionExpression(
          null,
          createConstructorArgs(),
          j.blockStatement(
            [].concat(
              [
                j.expressionStatement(
                  j.callExpression(
                    j.identifier('super'),
                    [j.identifier('props'), j.identifier('context')]
                  )
                ),
              ],
              inlineGetInitialState(getInitialState)
            )
          )
        ),
      }),
    ];
  };

  const copyReturnType = (to, from) => {
    to.returnType = from.returnType;
    return to;
  };

  const createArrowFunctionExpression = fn =>
    copyReturnType(j.arrowFunctionExpression(
      fn.params,
      fn.body,
      false
    ), fn);

  const createArrowPropertyFromMethod = method =>
    withComments(j.classProperty(
      j.identifier(method.key.name),
      createArrowFunctionExpression(method.value),
      null,
      false
    ), method);

  // if there's no `getInitialState` or the `getInitialState` function is simple
  // (i.e., it does not reference `this.props`) then we don't need a constructor.
  // we can simply lift `state = {...}` as a property initializer.
  // otherwise, create a constructor and inline `this.state = ...`.
  //
  // It creates a class with the following order of properties/methods:
  // 1. static properties
  // 2. constructor (if necessary)
  // 3. new properties (`state = {...};`)
  // 4. arrow functions
  // 5. other methods
  const createESClass = (
    name,
    baseClassName,
    staticProperties,
    getInitialState,
    methods,
    comments
  ) => {
    let maybeConstructor = [];
    const initialStateProperty = [];

    if (isInitialStateLiftable(getInitialState)) {
      if (getInitialState) {
        initialStateProperty.push(convertInitialStateToClassProperty(getInitialState));
      }
    } else {
      maybeConstructor = createConstructor(getInitialState);
    }

    const arrowBindFunctionsAndMethods = methods.map(method =>
      AUTOBIND_IGNORE_KEYS[method.key.name] ?
        method :
        createArrowPropertyFromMethod(method)
    );

    return withComments(j.classDeclaration(
      name ? j.identifier(name) : null,
      j.classBody(
        [].concat(
          staticProperties,
          maybeConstructor,
          initialStateProperty,
          arrowBindFunctionsAndMethods
        )
      ),
      j.memberExpression(
        j.identifier('React'),
        j.identifier(baseClassName),
        false
      )
    ), {comments});
  };

  const createStaticClassProperty = staticProperty =>
    withComments(j.classProperty(
      j.identifier(staticProperty.key.name),
      staticProperty.value,
      null,
      true
    ), staticProperty);

  const createStaticClassProperties = statics =>
    statics.map(createStaticClassProperty);

  const hasSingleReturnStatement = value => (
    value.type === 'FunctionExpression' &&
    value.body &&
    value.body.type === 'BlockStatement' &&
    value.body.body &&
    value.body.body.length === 1 &&
    value.body.body[0].type === 'ReturnStatement' &&
    value.body.body[0].argument &&
    value.body.body[0].argument.type === 'ObjectExpression'
  );

  const createDefaultProps = prop =>
    withComments(
      j.property(
        'init',
        j.identifier(DEFAULT_PROPS_KEY),
        pickReturnValueOrCreateIIFE(prop.value)
      ),
      prop
    );

  const getComments = classPath => {
    if (classPath.value.comments) {
      return classPath.value.comments;
    }
    const declaration = j(classPath).closest(j.VariableDeclaration);
    if (declaration.size()) {
      return declaration.get().value.comments;
    }
    return null;
  };

  const updateToClass = (classPath, type) => {
    const specPath = ReactUtils.getReactCreateClassSpec(classPath);
    const name = ReactUtils.getComponentName(classPath);
    const statics = collectStatics(specPath);
    const functions = collectFunctions(specPath);
    const comments = getComments(classPath);

    const getInitialState = findGetInitialState(specPath);

    var path;
    if (type == 'moduleExports' || type == 'exportDefault') {
      path = ReactUtils.findReactCreateClassCallExpression(classPath);
    } else {
      path = j(classPath).closest(j.VariableDeclaration);
    }

    const staticProperties = createStaticClassProperties(statics);
    const baseClassName =
      pureRenderMixinPathAndBinding &&
      ReactUtils.hasSpecificMixins(classPath, [pureRenderMixinPathAndBinding.binding]) ?
        'PureComponent' :
        'Component';

    path.replaceWith(
      createESClass(
        name,
        baseClassName,
        staticProperties,
        getInitialState,
        functions.map(createMethodDefinition),
        comments
      )
    );
  };

  if (
    options['explicit-require'] === false || ReactUtils.hasReact(root)
  ) {
    // no mixins found on the classPath -> true
    // pure mixin identifier not found -> (has mixins) -> false
    // found pure mixin identifier ->
    //   class mixins only contain the identifier -> true
    //   otherwise -> false
    const mixinsFilter = (classPath) => {
      if (!ReactUtils.hasMixins(classPath)) {
        return true;
      } else if (pureRenderMixinPathAndBinding) {
        if (areMixinsConvertible([pureRenderMixinPathAndBinding.binding], classPath)) {
          return true;
        }
      }
      console.log(
        file.path + ': `' + ReactUtils.getComponentName(classPath) + '` ' +
        'was skipped because of inconvertible mixins.'
      );
      return false;
    };

    const apply = (path, type) =>
      path
        .filter(mixinsFilter)
        .filter(callsDeprecatedAPIs)
        .filter(canConvertToClass)
        .forEach(classPath => updateToClass(classPath, type));

    const didTransform = (
      apply(ReactUtils.findReactCreateClass(root), 'var')
        .size() +
      apply(ReactUtils.findReactCreateClassModuleExports(root), 'moduleExports')
        .size() +
      apply(ReactUtils.findReactCreateClassExportDefault(root), 'exportDefault')
        .size()
    ) > 0;

    if (didTransform) {
      // prune removed requires
      if (pureRenderMixinPathAndBinding) {
        // FIXME check the scope before removing stuff
        j(pureRenderMixinPathAndBinding.path).remove();
      }

      return root.toSource(printOptions);
    }

  }

  return null;
};
