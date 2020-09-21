/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * class Component extends React.Component {
 *   constructor() { this.onClick = this.onClick.bind(this); }
 *   onClick() { }
 * }
 *
 * -->
 *
 * class Component extends React.Component {
 *   onClick = () => { }
 * }
 */

export default function transformer(file, api, options) {
  const j = api.jscodeshift;
  const doesNotUseArguments = require('./utils/doesNotUseArguments')(j);

  const printOptions = options.printOptions || {};
  var root = j(file.source);

  // Helper functions to transform a method declaration to an arrow function
  // By default recast drops comments and jscodeshift doesn't have a way to
  // set the return type in the convenience method. Otherwise we would have
  // inlined all those.
  function withComments(to, from) {
    to.comments = from.comments;
    return to;
  }

  function createArrowFunctionExpression(fn) {
    var arrowFunc = j.arrowFunctionExpression(fn.params, fn.body, false);

    arrowFunc.returnType = fn.returnType;
    arrowFunc.defaults = fn.defaults;
    arrowFunc.rest = fn.rest;
    arrowFunc.async = fn.async;

    return arrowFunc;
  }

  function createArrowProperty(prop) {
    return withComments(
      j.classProperty(
        j.identifier(prop.key.name),
        createArrowFunctionExpression(prop.value),
        null,
        false
      ),
      prop
    );
  }

  var hasChanged = false;
  var transform = root.find(j.AssignmentExpression).forEach(path => {
    // Check that the englobing function is constructor
    var methodPath = path;
    while (
      methodPath &&
      (methodPath.node.type !== 'MethodDefinition' ||
        methodPath.node.kind !== 'constructor')
    ) {
      methodPath = methodPath.parentPath;
    }
    if (!methodPath) {
      return;
    }

    // Check that it looks like
    // this.method = this.method.bind(this);
    // or
    // (this: any).method = this.method.bind(this);
    // or
    // self.method = this.method.bind(this);
    if (
      !(
        path.node.left.type === 'MemberExpression' &&
        // this
        (path.node.left.object.type === 'ThisExpression' ||
          // self
          (path.node.left.object.type === 'Identifier' &&
            path.node.left.object.name === 'self') ||
          // (this: any)
          (path.node.left.object.type === 'TypeCastExpression' &&
            path.node.left.object.expression.type === 'ThisExpression')) &&
        path.node.left.property.type === 'Identifier' &&
        path.node.right.type === 'CallExpression' &&
        path.node.right.callee.type === 'MemberExpression' &&
        path.node.right.callee.property.type === 'Identifier' &&
        path.node.right.callee.property.name === 'bind' &&
        path.node.right.callee.object.type === 'MemberExpression' &&
        path.node.right.callee.object.property.type === 'Identifier' &&
        path.node.right.callee.object.object.type === 'ThisExpression' &&
        path.node.left.property.name ===
          path.node.right.callee.object.property.name &&
        true
      )
    ) {
      return;
    }

    // Find the method() declaration and replace it with an arrow function
    var methodName = path.node.left.property.name;

    const componentDecl = methodPath.parentPath;
    var methods = j(componentDecl)
      .find(j.MethodDefinition)
      .filter(
        path =>
          path.node.key.type === 'Identifier' &&
          path.node.key.name === methodName &&
          doesNotUseArguments(path, file.path)
      );

    // Do not remove the binding if there's no corresponding method to turn
    // into an arrow function, or if the method uses `arguments` keyword inside
    // it.
    if (methods.size() === 0) {
      return;
    }
    methods.replaceWith(path => createArrowProperty(path.node));

    // Remove the line
    // this.method = this.method.bind(this);
    j(path.parentPath).remove();

    var selfCount = j(methodPath)
      .find(j.Identifier, { name: 'self' })
      .size();
    if (selfCount === 1) {
      // Remove the line
      // const self: any = this;
      // If self is present somewhere else in the method, then it is
      // not safe to do.
      j(methodPath)
        .find(j.VariableDeclaration)
        .filter(
          path =>
            j(path)
              .find(j.Identifier, { name: 'self' })
              .size() === 1
        )
        .remove();
    }

    // If we delete everything from the constructor but the super() call,
    // then delete the entire constructor.
    var canDeleteConstructor = true;
    methodPath.node.value.body.body.forEach(node => {
      if (
        !node ||
        (node.type === 'ExpressionStatement' &&
          node.expression.type === 'CallExpression' &&
          // babylon parser
          (node.expression.callee.type === 'Super' ||
            // flow parser
            (node.expression.callee.type === 'Identifier' &&
              node.expression.callee.name === 'super')))
      ) {
        return;
      }
      canDeleteConstructor = false;
    });
    if (canDeleteConstructor) {
      j(methodPath).remove();
    }

    hasChanged++;
  });

  if (hasChanged) {
    return transform.toSource(printOptions);
  }
  return null;
}

// module.exports.parser = 'flow';
