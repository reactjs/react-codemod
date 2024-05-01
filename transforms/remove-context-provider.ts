import type { API, FileInfo } from 'jscodeshift';

export default function transform(
  file: FileInfo,
  api: API,
): string | undefined {
  const j = api.jscodeshift;
  const root = j(file.source);

  let isDirty = false;

  root.findJSXElements().forEach((elementPath) => {
    const { value } = elementPath;
    const elements = [value.openingElement, value.closingElement];
    elements.forEach((element) => {
      if (!element) {
        return;
      }
      if (
        !j.JSXMemberExpression.check(element.name) ||
        !j.JSXIdentifier.check(element.name.object)
      ) {
        return;
      }

      const objectName = element.name.object.name;
      const propertyName = element.name.property.name;

      if (
        objectName.toLocaleLowerCase().includes('context') &&
        propertyName === 'Provider'
      ) {
        element.name = element.name.object;
        isDirty = true;
      }
    });
  });

  return isDirty ? root.toSource() : undefined;
}
