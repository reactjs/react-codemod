import type {
  API,
  ArrowFunctionExpression,
  CallExpression,
  FileInfo,
  FunctionExpression,
  Identifier,
  JSCodeshift,
  TSTypeLiteral,
  TSTypeReference,
  TSTypeParameterInstantiation,
} from "jscodeshift";

// Props & { ref: React.RefObject<Ref>}
const buildPropsAndRefIntersectionTypeAnnotation = (
  j: JSCodeshift,
  propType: TSTypeReference | TSTypeLiteral,
  refType: TSTypeReference | TSTypeLiteral | null
) =>
  j.tsTypeAnnotation(
    j.tsIntersectionType([
      propType,
      j.tsTypeLiteral([
        j.tsPropertySignature.from({
          key: j.identifier("ref"),
          typeAnnotation: j.tsTypeAnnotation(
            j.tsTypeReference.from({
              typeName: j.tsQualifiedName(
                j.identifier("React"),
                j.identifier("RefObject")
              ),
              typeParameters: j.tsTypeParameterInstantiation([
                refType === null ? j.tsUnknownKeyword() : refType,
              ]),
            })
          ),
        }),
      ]),
    ])
  );

// { ref: refName, ...propsName }
const buildRefAndPropsObjectPattern = (
  j: JSCodeshift,
  refArgName: string,
  propArgName: string
) =>
  j.objectPattern([
    j.objectProperty.from({
      shorthand: true,
      key: j.identifier("ref"),
      value: j.identifier(refArgName),
    }),
    j.restProperty(j.identifier(propArgName)),
  ]);

// React.ForwardedRef<HTMLButtonElement> => HTMLButtonElement
const getRefTypeFromRefArg = (j: JSCodeshift, refArg: Identifier) => {
  const typeReference = refArg.typeAnnotation?.typeAnnotation;
  if (
    !j.TSTypeReference.check(typeReference) ||
    !j.TSQualifiedName.check(typeReference.typeName)
  ) {
    return null;
  }

  const { right } = typeReference.typeName;

  if (!j.Identifier.check(right) || right.name === "forwardedRef") {
    return null;
  }

  const [firstTypeParameter] = typeReference.typeParameters?.params ?? [];

  if (!j.TSTypeReference.check(firstTypeParameter)) {
    return null;
  }

  return firstTypeParameter;
};

const getForwardRefRenderFunction = (
  j: JSCodeshift,
  callExpression: CallExpression
): FunctionExpression | ArrowFunctionExpression | null => {
  const [renderFunction] = callExpression.arguments;

  if (
    !j.FunctionExpression.check(renderFunction) &&
    !j.ArrowFunctionExpression.check(renderFunction)
  ) {
    return null;
  }

  return renderFunction;
};

const isLiteralOrReference = (
  j: JSCodeshift,
  type: unknown
): type is TSTypeReference | TSTypeLiteral => {
  return j.TSTypeReference.check(type) || j.TSTypeLiteral.check(type);
};

export default function transform(file: FileInfo, api: API) {
  const j = api.jscodeshift;

  const root = j(file.source);

  let isDirty = false;

  let reactForwardRefImportLocalName: string | null = null;
  let reactDefaultImportName: string | null = null;

  root
    .find(j.ImportDeclaration, {
      source: { value: "react" },
    })
    .forEach((path) => {
      path.value.specifiers?.forEach((specifier) => {
        // named import
        if (
          j.ImportSpecifier.check(specifier) &&
          specifier.imported.name === "forwardRef"
        ) {
          reactForwardRefImportLocalName = specifier.local?.name ?? null;
        }

        // default and wildcard import
        if (
          j.ImportDefaultSpecifier.check(specifier) ||
          j.ImportNamespaceSpecifier.check(specifier)
        ) {
          reactDefaultImportName = specifier.local?.name ?? null;
        }
      });
    });

  root
    .find(j.CallExpression)
    .filter((path) => {
      const { callee } = path.value;

      if (
        j.Identifier.check(callee) &&
        callee.name === reactForwardRefImportLocalName
      ) {
        return true;
      }

      if (
        j.MemberExpression.check(callee) &&
        j.Identifier.check(callee.object) &&
        callee.object.name === reactDefaultImportName &&
        j.Identifier.check(callee.property) &&
        callee.property.name === "forwardRef"
      ) {
        return true;
      }

      return false;
    })
    .replaceWith((callExpressionPath) => {
      const originalCallExpression = callExpressionPath.value;

      const renderFunction = getForwardRefRenderFunction(
        j,
        callExpressionPath.node
      );

      if (renderFunction === null) {
        console.warn("Could not detect render function.");

        return originalCallExpression;
      }

      const [propsArg, refArg] = renderFunction.params;

      if (
        !j.Identifier.check(refArg) ||
        !(j.Identifier.check(propsArg) || j.ObjectPattern.check(propsArg))
      ) {
        console.warn("Could not detect ref or props arguments.");

        return originalCallExpression;
      }

      const refArgTypeReference = getRefTypeFromRefArg(j, refArg);
      const refArgName = refArg.name;

      const propsArgTypeReference = propsArg.typeAnnotation?.typeAnnotation;
      // remove refArg
      renderFunction.params.splice(1, 1);

      // if propsArg is ObjectPattern, add ref as new ObjectProperty
      if (j.ObjectPattern.check(propsArg)) {
        propsArg.properties.unshift(
          j.objectProperty.from({
            shorthand: true,
            key: j.identifier("ref"),
            value: j.identifier(refArgName),
          })
        );

        isDirty = true;
      }

      // if props arg is Identifier, push ref variable declaration to the function body
      if (j.Identifier.check(propsArg)) {
        renderFunction.params[0] = buildRefAndPropsObjectPattern(
          j,
          refArg.name,
          propsArg.name
        );

        isDirty = true;
      }

      /**
       * Transform ts types: render function props and ref are typed
       */

      if (
        isLiteralOrReference(j, propsArgTypeReference) &&
        renderFunction.params?.[0] &&
        "typeAnnotation" in renderFunction.params[0]
      ) {
        renderFunction.params[0].typeAnnotation =
          buildPropsAndRefIntersectionTypeAnnotation(
            j,
            propsArgTypeReference,
            refArgTypeReference
          );
        isDirty = true;
      }

      /**
       * Transform ts types: forwardRef type arguments are used
       */

      const typeParameters = (
        callExpressionPath.node as CallExpression & {
          typeParameters?: TSTypeParameterInstantiation;
        }
      ).typeParameters;

      // if typeParameters are used in forwardRef generic, reuse them to annotate props type
      // forwardRef<Ref, Props>((props) => { ... }) ====> (props: Props & { ref: React.RefObject<Ref> }) => { ... }
      if (
        j.TSTypeParameterInstantiation.check(typeParameters) &&
        renderFunction.params?.[0] &&
        "typeAnnotation" in renderFunction.params[0]
      ) {
        const [refType, propType] = typeParameters.params;

        if (
          j.TSTypeReference.check(refType) &&
          isLiteralOrReference(j, propType)
        ) {
          renderFunction.params[0].typeAnnotation =
            buildPropsAndRefIntersectionTypeAnnotation(j, propType, refType);

          isDirty = true;
        }
      }

      return renderFunction;
    });

  /**
   * handle import
   */
  if (isDirty) {
    root
      .find(j.ImportDeclaration, {
        source: {
          value: "react",
        },
      })
      .forEach((importDeclarationPath) => {
        const { specifiers, importKind } = importDeclarationPath.node;

        if (importKind !== "value") {
          return;
        }

        const specifiersWithoutForwardRef =
          specifiers?.filter(
            (s) =>
              !j.ImportSpecifier.check(s) || s.imported.name !== "forwardRef"
          ) ?? [];

        if (specifiersWithoutForwardRef.length === 0) {
          j(importDeclarationPath).remove();
        }

        importDeclarationPath.node.specifiers = specifiersWithoutForwardRef;
      });
  }

  return isDirty ? root.toSource() : undefined;
}
