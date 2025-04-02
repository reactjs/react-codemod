import type {
  API,
  ASTPath,
  Collection,
  FileInfo,
  JSCodeshift,
  MemberExpression,
  ObjectProperty,
  Property,
  VariableDeclaration,
  RestElement,
} from "jscodeshift";

import {
  getFunctionName,
  getFunctionComponents,
} from "@codemod.com/codemod-utils";

const getComponentStaticPropValue = (
  j: JSCodeshift,
  root: Collection<any>,
  componentName: string,
  name: string
): ASTPath<MemberExpression> | null => {
  return (
    root
      .find(j.MemberExpression, {
        object: {
          type: "Identifier",
          name: componentName,
        },
        property: {
          type: "Identifier",
          name,
        },
      })
      .paths()
      .at(0) ?? null
  );
};

const buildPropertyWithDefaultValue = (
  j: JSCodeshift,
  property: ObjectProperty | Property,
  defaultValue: any
) => {
  if (property.value.type === "ObjectPattern") {
    return j.assignmentPattern(property.value, defaultValue);
  }

  if (!j.Identifier.check(property.key)) {
    return property.value;
  }

  const identifier = j.identifier(property.key.name);
  return j.assignmentPattern(identifier, defaultValue);
};

export default function transform(
  file: FileInfo,
  api: API
): string | undefined {
  const j = api.jscodeshift;
  const root = j(file.source);
  let isDirty = false;

  getFunctionComponents(j, root).forEach((path) => {
    const componentName = getFunctionName(j, path);

    if (componentName === null) {
      return;
    }

    const componentFunction = j.functionDeclaration(
      j.identifier(componentName),
      path.value.params,
      path.value.body
    );

    if (componentFunction === null) {
      return;
    }

    const defaultProps = getComponentStaticPropValue(
      j,
      root,
      componentName,
      "defaultProps"
    );

    const defaultPropsRight = defaultProps?.parent?.value?.right ?? null;

    if (!defaultProps || !j.ObjectExpression.check(defaultPropsRight)) {
      return;
    }

    const defaultPropsMap = new Map();
    const defaultPropsConstants: VariableDeclaration[] = [];

    defaultPropsRight.properties?.forEach((property) => {
      if (
        (j.Property.check(property) || j.ObjectProperty.check(property)) &&
        j.Identifier.check(property.key)
      ) {
        if (
          property.value.type === "ObjectExpression" ||
          property.value.type === "ArrayExpression" ||
          property.value.type === "ArrowFunctionExpression"
        ) {
          const constName = `${componentName[0]?.toLowerCase()}${componentName.slice(
            1
          )}DefaultProp${
            property.key.name[0]?.toUpperCase() + property.key.name.slice(1)
          }`;
          const constNamePath = root
            .find(j.Identifier, {
              name: constName,
            })
            .paths();
          if (constNamePath.length) {
            return defaultPropsMap.set(property.key.name, property.value);
          }
          defaultPropsConstants.push(
            j.variableDeclaration("const", [
              j.variableDeclarator(j.identifier(constName), property.value),
            ])
          );
          defaultPropsMap.set(property.key.name, j.identifier(constName));
        } else {
          defaultPropsMap.set(property.key.name, property.value);
        }
      }
    });

    const propsArg = path.value.params.at(0);
    let inlineDefaultProps: { key: string; value: any }[] = [];
    let propsArgName: string | undefined;

    if (j.ObjectPattern.check(propsArg)) {
      propsArg.properties.forEach((property) => {
        if (
          (j.Property.check(property) || j.ObjectProperty.check(property)) &&
          j.Identifier.check(property.key)
        ) {
          if (defaultPropsMap.has(property.key.name)) {
            isDirty = true;
            property.value = buildPropertyWithDefaultValue(
              j,
              property,
              defaultPropsMap.get(property.key.name)
            );
            defaultPropsMap.delete(property.key.name);
          }
        } else if (j.RestElement.check(property)) {
          const restElement = property as RestElement;
          if (j.Identifier.check(restElement.argument)) {
            propsArgName = restElement.argument.name;
            inlineDefaultProps = Array.from(defaultPropsMap.entries()).map(
              ([key, value]) => ({ key, value })
            );
          }
        }
      });
    } else if (j.Identifier.check(propsArg)) {
      propsArgName = propsArg.name;
      inlineDefaultProps = Array.from(defaultPropsMap.entries()).map(
        ([key, value]) => ({ key, value })
      );
    }

    if (propsArgName && inlineDefaultProps.length) {
      componentFunction.body.body.unshift(
        j.expressionStatement(
          j.assignmentExpression(
            "=",
            j.identifier(propsArgName),
            j.objectExpression([
              j.spreadElement(j.identifier(propsArgName)),
              ...inlineDefaultProps.map(({ key, value }) =>
                j.objectProperty(
                  j.identifier(key),
                  j.conditionalExpression(
                    j.binaryExpression(
                      "===",
                      j.unaryExpression(
                        "typeof",
                        j.identifier(`${propsArgName}.${key}`)
                      ),
                      j.literal("undefined")
                    ),
                    value,
                    j.identifier(`${propsArgName}.${key}`)
                  )
                )
              ),
            ])
          )
        )
      );
    }

    if (defaultPropsConstants.length && path.parent) {
      for (let defaultPropsConstant of defaultPropsConstants) {
        path.parent.parent.insertBefore(defaultPropsConstant);
      }
    }

    j(defaultProps).closest(j.ExpressionStatement).remove();
    isDirty = true;
  });

  return isDirty ? root.toSource() : undefined;
}
