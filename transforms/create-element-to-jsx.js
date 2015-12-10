module.exports = function(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const ReactUtils = require('./utils/ReactUtils')(j);

  const convertObjectExpressionToJSXAttributes = (objectExpression) => {
    if (objectExpression.type === 'Identifier') {
      return [j.jsxSpreadAttribute(objectExpression)];
    }

    const isReactSpread = objectExpression.type === 'CallExpression' &&
      objectExpression.callee.type === 'MemberExpression' &&
      objectExpression.callee.object.name === 'React' &&
      objectExpression.callee.property.name === '__spread';

    const isObjectAssign = objectExpression.type === 'CallExpression' &&
      objectExpression.callee.type === 'MemberExpression' &&
      objectExpression.callee.object.name === 'Object' &&
      objectExpression.callee.property.name === 'assign';

    if (isReactSpread || isObjectAssign) {
      var jsxAttributes = [];

      objectExpression.arguments.forEach((objectExpression) =>
        jsxAttributes.push(...convertObjectExpressionToJSXAttributes(objectExpression))
      );

      return jsxAttributes;
    }

    if (!objectExpression.properties) {
      return [];
    }

    const attributes = objectExpression.properties.map((property) => {
      if (property.type === 'SpreadProperty') {
        return j.jsxSpreadAttribute(property.argument);
      }  else if (property.type === 'Property') {
        const propertyValueType = property.value.type;

        let value;
        if (propertyValueType === 'Literal' && typeof property.value.value === 'string') {
          value = j.literal(property.value.value);
        } else {
          value = j.jsxExpressionContainer(property.value);
        }

        let propertyKeyName;
        if (property.key.type === 'Literal') {
          propertyKeyName = property.key.value;
        } else {
          propertyKeyName = property.key.name;
        }

        return j.jsxAttribute(
          j.jsxIdentifier(propertyKeyName),
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
      if (child.type === 'Literal' && typeof child.value === 'string') {
        return j.jsxText(child.value);
      } else if (child.type === 'CallExpression' &&
        child.callee.object &&
        child.callee.object.name === 'React' &&
        child.callee.property.name === 'createElement') {
        return convertNodeToJSX(node.get('arguments', index + 2));
      } else {
        return j.jsxExpressionContainer(child);
      }
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
