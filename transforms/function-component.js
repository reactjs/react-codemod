const buildReactUtils = require('./utils/ReactUtils');

function isSimpleReactConstructor(path) {
  return path
    && path.value.body.body.length === 1
    && path.value.body.body[0].expression.callee.type === 'Super';
}

function getConstructor(path) {
  return path.value.body.body.find(method => method.key.name === 'constructor');
}

function getRenderMethod(path) {
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
    const componentConstructor = getConstructor(path);

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
    const thisCount = j(getRenderMethod(path))
       .find(j.ThisExpression)
       .size();

    const thisPropsCount = j(getRenderMethod(path))
      .find(j.MemberExpression)
      .filter(path => path.value.object.type === 'ThisExpression' && path.value.property.name === 'props')
      .size();

    if (thisCount > thisPropsCount) {
      console.warn(
        file.path + ': `' + ReactUtils.getComponentName(path) + '` ' +
        'was skipped because it has a reference to `this` other than `this.props`'
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

      const thisPropsPaths = j(getRenderMethod(classPath))
        .find(j.MemberExpression, {
          object: {
            type: 'ThisExpression'
          },
          property: {
            name: 'props'
          }
        });

      thisPropsPaths.replaceWith(() => j.identifier('props'));

      if (thisPropsPaths.size() > 0) {
        const usesPropsStandalone = j(getRenderMethod(classPath))
          .find(j.Identifier, {
            name: 'props'
          })
          .filter(path => path.parentPath.value.type !== 'MemberExpression')
          .size() > 0;

        if (!usesPropsStandalone) {
          const propsSuitableForDestructuring = j(getRenderMethod(classPath))
            .find(j.MemberExpression, {
              object: {
                name: 'props'
              }
            });

          propsSuitableForDestructuring.forEach(path => destructuredProps.add(path.value.property.name));
          propsSuitableForDestructuring.replaceWith(path => j.identifier(path.value.property.name));
        }
      }

      const createFunction = classPath.type === 'ClassExpression' ? j.functionExpression : j.functionDeclaration;

      return createFunction(
        j.identifier(classPath.value.id.name),
        destructuredProps.size > 0 ? [j.objectExpression([...destructuredProps.values()].map(prop => {
          const property = j.property('init', j.identifier(prop), j.identifier(prop));
          property.shorthand = true;
          return property;
        }))] : thisPropsPaths.size() > 0 ? [j.identifier('props')] : [],
        getRenderMethod(classPath).value.body
      );
    });

  clearUpImports(j, root);

  return root.toSource(options.printOptions || {
    quote: 'single'
  });
};
