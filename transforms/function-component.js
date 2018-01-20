const buildReactUtils = require('./utils/ReactUtils');

function isSimpleReactConstructor(path) {
  return path
    && path.value.body.body.length === 1
    && path.value.body.body[0].expression.callee.type === 'Super';
}

function findConstructor(path) {
  return path.value.body.body.find(method => method.key.name === 'constructor');
}

function findRenderMethod(path) {
  return path.value.body.body.find(method => method.key.name === 'render');
}

function unknownMethods(j, file) {
  const ReactUtils = buildReactUtils(j);

  return path => {
    const methodNames = new Set(j(path).find(j.MethodDefinition).nodes().map(node => node.key.name));
    methodNames.delete('constructor');
    methodNames.delete('render');

    const noUnknownMethods = methodNames.size === 0;

    if (!noUnknownMethods) {
      console.warn(
        file.path + ': `' + ReactUtils.getComponentName(path) + '` ' +
        'was skipped because of unknown methods'
      );
    }

    return noUnknownMethods;
  };
}

function hasNoRefs(j, file) {
  const ReactUtils = buildReactUtils(j);

  return path => {
    const noRefs = j(path)
       .find(j.JSXAttribute, {
         name: {
           type: 'JSXIdentifier',
           name: 'ref',
         },
       })
       .size() === 0;

    if (!noRefs) {
      console.warn(
        file.path + ': `' + ReactUtils.getComponentName(path) + '` ' +
        'was skipped because function components do not support refs'
      );
    }

    return noRefs;
  };
}

function unknownConstructor(j, file) {
  const ReactUtils = buildReactUtils(j);

  return path => {
    const componentConstructor = findConstructor(path);

    if (componentConstructor && !isSimpleReactConstructor(componentConstructor)) {
      console.warn(
        file.path + ': `' + ReactUtils.getComponentName(path) + '` ' +
        'was skipped because it has a complex constructor'
      );
      return false;
    }

    return true;
  };
}

function unknownThisReference(j, file) {
  const ReactUtils = buildReactUtils(j);

  return path => {
    const renderMethod = j(findRenderMethod(path));
    const thisCount = renderMethod
       .find(j.ThisExpression)
       .size();

    const thisPropsContextCount = renderMethod
      .find(j.MemberExpression)
      .filter(path => path.value.object.type === 'ThisExpression' && ['props', 'context'].includes(path.value.property.name))
      .size();

    if (thisCount > thisPropsContextCount) {
      console.warn(
        file.path + ': `' + ReactUtils.getComponentName(path) + '` ' +
        'was skipped because it has a reference to `this` other than `this.props` or `this.context`'
      );

      return false;
    }

    return true;
  };
}

// find the nearest collection this item is inside
function findCollectionForItem(path) {
  return Array.isArray(path.parentPath.value) ? path : findCollectionForItem(path.parentPath);
}

function findComponentImportSpecifiers(j, path) {
  return j(path).find(j.ImportSpecifier, {
    imported: {
      name: 'Component'
    }
  });
}

function clearUpImports(j, root) {
  const ReactUtils = buildReactUtils(j);

  if (ReactUtils.findReactES6ClassDeclaration(root).size() === 0) {
      root
        .find(j.ImportDeclaration, {
          source: {
            value: 'react'
          }
        })
        .filter(path => findComponentImportSpecifiers(j, path).size() > 0)
        .forEach(path => {
          findComponentImportSpecifiers(j, path).remove();
        });
  }
}

function createShorthandProperty(j) {
  return (prop) => {
    const property = j.property('init', j.identifier(prop), j.identifier(prop));
    property.shorthand = true;
    return property;
  }
}


module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const ReactUtils = require('./utils/ReactUtils')(j);

  const root = j(file.source);

  ReactUtils.findReactES6ClassDeclaration(root)
    .filter(unknownMethods(j, file))
    .filter(hasNoRefs(j, file))
    .filter(unknownConstructor(j, file))
    .filter(unknownThisReference(j, file))
    .replaceWith(classPath => {
      const destructuredProps = new Set();
      const renderMethodPath = findRenderMethod(classPath);
      const renderMethod = j(renderMethodPath);

      j(classPath)
        .find(j.ClassProperty)
        .filter(path => path.value.static)
        .forEach(classPropertyPath => {
          j(findCollectionForItem(classPath)).insertAfter(j.expressionStatement(j.assignmentExpression(
            '=',
            j.memberExpression(j.identifier(classPath.value.id.name), j.identifier(classPropertyPath.value.key.name)),
            classPropertyPath.value.value
          )));
        });

      const thisPropsPaths = renderMethod.find(j.MemberExpression, {
        object: {
          type: 'ThisExpression'
        },
        property: {
          name: 'props'
        }
      });

      thisPropsPaths.replaceWith(() => j.identifier('props'));

      const thisContextPaths = renderMethod.find(j.MemberExpression, {
        object: {
          type: 'ThisExpression'
        },
        property: {
          name: 'context'
        }
      });

      thisContextPaths.replaceWith(() => j.identifier('context'));

      if (thisPropsPaths.size() > 0) {
        const usesPropsStandalone = renderMethod
          .find(j.Identifier, {
            name: 'props'
          })
          .filter(path => path.parentPath.value.type !== 'MemberExpression')
          .size() > 0;

        if (!usesPropsStandalone) {
          const propsSuitableForDestructuring = renderMethod.find(j.MemberExpression, {
            object: {
              name: 'props'
            }
          });

          propsSuitableForDestructuring.forEach(path => destructuredProps.add(path.value.property.name));
          propsSuitableForDestructuring.replaceWith(path => j.identifier(path.value.property.name));
        }
      }

      const functionComponentArguments = [];

      if (destructuredProps.size > 0) {
        functionComponentArguments.push(j.objectExpression([...destructuredProps.values()].map(createShorthandProperty(j))));
      } else if (thisPropsPaths.size() > 0) {
        functionComponentArguments.push(j.identifier('props'));
      }

      if (thisContextPaths.size() > 0) {
        functionComponentArguments.push(j.identifier('context'));
      }

      return (classPath.type === 'ClassExpression' ? j.functionExpression : j.functionDeclaration)(
        j.identifier(classPath.value.id.name),
        functionComponentArguments,
        renderMethodPath.value.body
      );
    });

  clearUpImports(j, root);

  return root.toSource(options.printOptions || {
    quote: 'single'
  });
};
