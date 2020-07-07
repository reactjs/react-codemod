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

  const reactImportPath = root
    .find(j.ImportDeclaration, {
      type: 'ImportDeclaration',
      source: {
        type: 'Literal',
      },
    })
    .filter(path => {
      return (
        path.value.source.value === 'React' ||
        path.value.source.value === 'react'
      );
    })
    .filter(path => {
      return (
        path.value.specifiers.length > 0 &&
        path.value.importKind === 'value' &&
        path.value.specifiers.some(
          specifier => specifier.local.name === 'React',
        )
      );
    });

  if (reactImportPath.size() > 1) {
    throw Error(
      'There should only be one React import. Please remove the duplicate import and try again.',
    );
  }

  if (reactImportPath.size() === 0) {
    return null;
  }

  const keepReactImport =
    root
      .find(j.Identifier, {
        name: 'React',
      })
      .filter(path => {
        return path.parent.parent.value.type !== 'ImportDeclaration';
      })
      .size() > 0;

  const reactPath = reactImportPath.paths()[0];
  const specifiers = reactPath.value.specifiers;

  for (let i = 0; i < specifiers.length; i++) {
    const specifier = specifiers[i];
    if (specifier.local.name === 'React') {
      if (specifier.type === 'ImportNamespaceSpecifier' && !keepReactImport) {
        j(reactPath).remove();
      } else if (specifier.type === 'ImportDefaultSpecifier') {
        if (keepReactImport) {
          j(reactPath).insertAfter(
            j.importDeclaration(
              [j.importNamespaceSpecifier(j.identifier('React'))],
              j.literal('react'),
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
              j.importDeclaration(regularImports, j.literal('react')),
            );
          }
          if (typeImports.length > 0) {
            j(reactPath).insertAfter(
              j.importDeclaration(typeImports, j.literal('react'), 'type'),
            );
          }
          j(reactPath).remove();
        } else {
          j(reactPath).remove();
        }
      } else {
        // nothing is transformed so we can return
        return null;
      }
    }
    break;
  }

  return root.toSource(printOptions);
};
