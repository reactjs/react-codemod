module.exports = function(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const ReactUtils = require('./utils/ReactUtils')(j);

  const convertObjectExpressionToJSXAttributes = (objectExpression) => {
    if (!objectExpression.properties) {
      return [];
    }

    const attributes = objectExpression.properties.map((property) => {
      if (property.type === 'SpreadProperty') {
        return j.jsxSpreadAttribute(property.argument);
      }  else if (property.type === 'Property') {
        const propertyValueType = property.value.type;

        let value;
        if (propertyValueType === 'Literal') {
          value = j.literal(property.value.value);
        } else {
          value = j.jsxExpressionContainer(property.value);
        }

        return j.jsxAttribute(
          j.jsxIdentifier(property.key.name),
          value
        );
      }
    });

    return attributes;
  };

  const convertNodeToJSX = (node) => {
    const args = node.value.arguments;

    const elementType = args[0].type;
    const elementName = elementType === 'Literal' ? args[0].value : args[0].name;
    const props = args[1];

    const attributes = convertObjectExpressionToJSXAttributes(props);

    const children = node.value.arguments.slice(2).map((child, index) => {
      if (child.type === 'Literal') {
        return j.literal(child.value);
      }

      return convertNodeToJSX(node.get('arguments', index + 2));
    });

    const openingElement = j.jsxOpeningElement(j.jsxIdentifier(elementName), attributes);

    if (children.length) {
      return j.jsxElement(
        openingElement,
        j.jsxClosingElement(j.jsxIdentifier(elementName)),
        children
      );
    } else {
      openingElement.selfClosing = true;
      return j.jsxElement(openingElement);
    }
  };

  if (ReactUtils.hasReact(root)) {
    const mutations = root
      .find(j.CallExpression, {
        callee: {
          object: {
            name: 'React',
          },
          property: {
            name: 'createElement',
          },
        },
      })
      .replaceWith(convertNodeToJSX)
      .size();

    if (mutations) {
      return root.toSource();
    }
  }

  return null;
};
