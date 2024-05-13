import type { API, FileInfo, Options } from 'jscodeshift';

export default function transform(
  file: FileInfo,
  api: API,
  options?: Options,
): string | undefined {
  const j = api.jscodeshift;
  const root = j(file.source);

  let isDirty = false;

  // Get default import from react
  const defaultReactImport =
    root
      .find(j.ImportDeclaration, {
        source: { value: 'react' },
        specifiers: [{ type: 'ImportDefaultSpecifier' }],
      })
      .paths()
      .at(0)
      ?.node.specifiers?.at(0)?.local?.name ?? 'React';

  // For usages like `import React from 'react'; React.useContext(ThemeContext)`
  root
    .find(j.MemberExpression, {
      object: { name: defaultReactImport },
      property: { name: 'useContext' },
    })
    .forEach((path) => {
      const identifierPath = j(path)
        .find(j.Identifier, { name: 'useContext' })
        .paths()
        .at(0);

      const newIdentifier = j.identifier.from({ name: 'use' });

      identifierPath?.replace(newIdentifier);
      isDirty = true;
    });

  // Get useContext import name
  let useContextImportLocalName: string | null = null;

  root
    .find(j.ImportDeclaration, {
      source: { value: 'react' },
    })
    .forEach((path) => {
      const useContextSpecifier = path.node.specifiers
        ?.filter(
          (specifier) =>
            j.ImportSpecifier.check(specifier) &&
            specifier.imported.name === 'useContext',
        )
        .at(0);

      useContextImportLocalName = useContextSpecifier?.local?.name ?? null;
    });

  if (useContextImportLocalName) {
    // For usages like `import { useContext } from 'react'; useContext(ThemeContext)`
    root
      .find(j.Identifier, { name: useContextImportLocalName })
      .forEach((path) => {
        // If parent is a member expression, we don't want that change, we handle React.useContext separately
        if (path.parentPath.node.type === 'MemberExpression') {
          return;
        }

        // In all other cases, replace usages of imported useContext with use
        if (path.node.type === 'Identifier') {
          const newIdentifier = j.identifier.from({ name: 'use' });

          path.replace(newIdentifier);

          isDirty = true;
        }
      });
  }

  return isDirty ? root.toSource() : undefined;
}
