/**
 * (c) Facebook, Inc. and its affiliates. Confidential and proprietary.
 *
 * @format
 */

'use strict';

module.exports = function(file, api, options) {
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {};
  const root = j(file.source);
  const destructureNamespaceImports = options.destructureNamespaceImports;

  // https://github.com/facebook/jscodeshift/blob/master/recipes/retain-first-comment.md
  function getFirstNode() {
    return root.find(j.Program).get('body', 0).node;
  }

  // Save the comments attached to the first node
  const firstNode = getFirstNode();
  const { comments } = firstNode;

  function isVariableDeclared(variable) {
    return (
      root
        .find(j.Identifier, {
          name: variable,
        })
        .filter(
          path =>
            path.parent.value.type !== 'MemberExpression' &&
            path.parent.value.type !== 'QualifiedTypeIdentifier' &&
            path.parent.value.type !== 'JSXMemberExpression',
        )
        .size() > 0
    );
  }

  // Get all paths that import from React
  const reactImportPaths = root
    .find(j.ImportDeclaration, {
      type: 'ImportDeclaration',
    })
    .filter(path => {
      return (
        (
          path.value.source.type === 'Literal' ||
          path.value.source.type === 'StringLiteral'
        ) && (
          path.value.source.value === 'React' ||
          path.value.source.value === 'react'
        )
      );
    });

  // get all namespace/default React imports
  const reactPaths = reactImportPaths.filter(path => {
    return (
      path.value.specifiers.length > 0 &&
      path.value.importKind === 'value' &&
      path.value.specifiers.some(specifier => specifier.local.name === 'React')
    );
  });

  if (reactPaths.size() > 1) {
    throw Error(
      'There should only be one React import. Please remove the duplicate import and try again.',
    );
  }

  if (reactPaths.size() === 0) {
    return null;
  }

  const reactPath = reactPaths.paths()[0];
  // Reuse the node so that we can preserve quoting style.
  const reactLiteral = reactPath.value.source;

  const isDefaultImport = reactPath.value.specifiers.some(
    specifier =>
      specifier.type === 'ImportDefaultSpecifier' &&
      specifier.local.name === 'React',
  );

  // Check to see if we should keep the React import
  const isReactImportUsed =
    root
      .find(j.Identifier, {
        name: 'React',
      })
      .filter(path => {
        return path.parent.parent.value.type !== 'ImportDeclaration';
      })
      .size() > 0;

  // local: imported
  const reactIdentifiers = {};
  const reactTypeIdentifiers = {};
  let canDestructureReactVariable = false;
  if (isReactImportUsed && (isDefaultImport || destructureNamespaceImports)) {
    // Checks to see if the react variable is used itself (rather than used to access its properties)
    canDestructureReactVariable =
      root
        .find(j.Identifier, {
          name: 'React',
        })
        .filter(path => {
          return path.parent.parent.value.type !== 'ImportDeclaration';
        })
        .filter(
          path =>
            !(
              path.parent.value.type === 'MemberExpression' &&
              path.parent.value.object.name === 'React'
            ) &&
            !(
              path.parent.value.type === 'QualifiedTypeIdentifier' &&
              path.parent.value.qualification.name === 'React'
            ) &&
            !(
              path.parent.value.type === 'JSXMemberExpression' &&
              path.parent.value.object.name === 'React'
            ),
        )
        .size() === 0;

    if (canDestructureReactVariable) {
      // Add React identifiers to separate object so we can destructure the imports
      // later if we can. If a type variable that we are trying to import has already
      // been declared, do not try to destructure imports
      // (ex. Element is declared and we are using React.Element)
      root
        .find(j.QualifiedTypeIdentifier, {
          qualification: {
            type: 'Identifier',
            name: 'React',
          },
        })
        .forEach(path => {
          const id = path.value.id.name;
          if (path.parent.parent.value.type === 'TypeofTypeAnnotation') {
            // This is a typeof import so it isn't actually a type
            reactIdentifiers[id] = id;

            if (reactTypeIdentifiers[id]) {
              canDestructureReactVariable = false;
            }
          } else {
            reactTypeIdentifiers[id] = id;

            if (reactIdentifiers[id]) {
              canDestructureReactVariable = false;
            }
          }

          if (isVariableDeclared(id)) {
            canDestructureReactVariable = false;
          }
        });

      // Add React identifiers to separate object so we can destructure the imports
      // later if we can. If a variable that we are trying to import has already
      // been declared, do not try to destructure imports
      // (ex. createElement is declared and we are using React.createElement)
      root
        .find(j.MemberExpression, {
          object: {
            type: 'Identifier',
            name: 'React',
          },
        })
        .forEach(path => {
          const property = path.value.property.name;
          reactIdentifiers[property] = property;

          if (isVariableDeclared(property) || reactTypeIdentifiers[property]) {
            canDestructureReactVariable = false;
          }
        });

      // Add React identifiers to separate object so we can destructure the imports
      // later if we can. If a JSX variable that we are trying to import has already
      // been declared, do not try to destructure imports
      // (ex. Fragment is declared and we are using React.Fragment)
      root
        .find(j.JSXMemberExpression, {
          object: {
            type: 'JSXIdentifier',
            name: 'React',
          },
        })
        .forEach(path => {
          const property = path.value.property.name;
          reactIdentifiers[property] = property;

          if (isVariableDeclared(property) || reactTypeIdentifiers[property]) {
            canDestructureReactVariable = false;
          }
        });
    }
  }

  if (canDestructureReactVariable) {
    // replace react identifiers
    root
      .find(j.QualifiedTypeIdentifier, {
        qualification: {
          type: 'Identifier',
          name: 'React',
        },
      })
      .forEach(path => {
        const id = path.value.id.name;

        j(path).replaceWith(j.identifier(id));
      });

    root
      .find(j.MemberExpression, {
        object: {
          type: 'Identifier',
          name: 'React',
        },
      })
      .forEach(path => {
        const property = path.value.property.name;

        j(path).replaceWith(j.identifier(property));
      });

    root
      .find(j.JSXMemberExpression, {
        object: {
          type: 'JSXIdentifier',
          name: 'React',
        },
      })
      .forEach(path => {
        const property = path.value.property.name;

        j(path).replaceWith(j.jsxIdentifier(property));
      });

    // Add exisiting React imports to map
    reactImportPaths.forEach(path => {
      const specifiers = path.value.specifiers;
      for (let i = 0; i < specifiers.length; i++) {
        const specifier = specifiers[i];
        // get all type and regular imports that are imported
        // from React
        if (specifier.type === 'ImportSpecifier') {
          if (
            path.value.importKind === 'type' ||
            specifier.importKind === 'type'
          ) {
            reactTypeIdentifiers[specifier.local.name] =
              specifier.imported.name;
          } else {
            reactIdentifiers[specifier.local.name] = specifier.imported.name;
          }
        }
      }
    });

    const regularImports = [];
    Object.keys(reactIdentifiers).forEach(local => {
      const imported = reactIdentifiers[local];
      regularImports.push(
        j.importSpecifier(j.identifier(imported), j.identifier(local)),
      );
    });

    const typeImports = [];
    Object.keys(reactTypeIdentifiers).forEach(local => {
      const imported = reactTypeIdentifiers[local];
      typeImports.push(
        j.importSpecifier(j.identifier(imported), j.identifier(local)),
      );
    });

    if (regularImports.length > 0) {
      j(reactPath).insertAfter(
        j.importDeclaration(regularImports, reactLiteral),
      );
    }
    if (typeImports.length > 0) {
      j(reactPath).insertAfter(
        j.importDeclaration(typeImports, reactLiteral, 'type'),
      );
    }

    // remove all old react imports
    reactImportPaths.forEach(path => {
      // This is for import type React from 'react' which shouldn't
      // be removed
      if (
        path.value.specifiers.some(
          specifier =>
            specifier.type === 'ImportDefaultSpecifier' &&
            specifier.local.name === 'React' &&
            (specifier.importKind === 'type' ||
              path.value.importKind === 'type'),
        )
      ) {
        j(path).insertAfter(
          j.importDeclaration(
            [j.importDefaultSpecifier(j.identifier('React'))],
            reactLiteral,
            'type',
          ),
        );
      }
      j(path).remove();
    });
  } else {
    // Remove the import because it's not being used
    // If we should keep the React import, just convert
    // default imports to named imports
    let isImportRemoved = false;
    const specifiers = reactPath.value.specifiers;
    for (let i = 0; i < specifiers.length; i++) {
      const specifier = specifiers[i];
      if (specifier.type === 'ImportNamespaceSpecifier') {
        if (!isReactImportUsed) {
          isImportRemoved = true;
          j(reactPath).remove();
        }
      } else if (specifier.type === 'ImportDefaultSpecifier') {
        if (isReactImportUsed) {
          j(reactPath).insertAfter(
            j.importDeclaration(
              [j.importNamespaceSpecifier(j.identifier('React'))],
              reactLiteral,
            ),
          );
        }

        if (specifiers.length > 1) {
          const typeImports = [];
          const regularImports = [];
          for (let x = 0; x < specifiers.length; x++) {
            if (specifiers[x].type !== 'ImportDefaultSpecifier') {
              if (specifiers[x].importKind === 'type') {
                typeImports.push(specifiers[x]);
              } else {
                regularImports.push(specifiers[x]);
              }
            }
          }
          if (regularImports.length > 0) {
            j(reactPath).insertAfter(
              j.importDeclaration(regularImports, reactLiteral),
            );
          }
          if (typeImports.length > 0) {
            j(reactPath).insertAfter(
              j.importDeclaration(typeImports, reactLiteral, 'type'),
            );
          }
        }

        isImportRemoved = true;
        j(reactPath).remove();
      }
    }

    if (!isImportRemoved) {
      return null;
    }
  }

  // If the first node has been modified or deleted, reattach the comments
  const firstNode2 = getFirstNode();
  if (firstNode2 !== firstNode) {
    firstNode2.comments = comments;
  }

  return root.toSource(printOptions);
};
