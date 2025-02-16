/*! @license

ISC License

Copyright (c) 2023, Mark Skelton

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

/*
Changes to the original file: fixed ts errors
*/

import type { NodePath } from "ast-types/lib/node-path.js";
import type {
  API,
  Collection,
  CommentBlock,
  CommentLine,
  FileInfo,
  Identifier,
  JSCodeshift,
  Literal,
  Options,
  TSAnyKeyword,
  TSFunctionType,
} from "jscodeshift";

let j: JSCodeshift;
let options: {
  preservePropTypes: "none" | "unconverted" | "all";
};

function reactType(type: string) {
  return j.tsQualifiedName(j.identifier("React"), j.identifier(type));
}

type TSType = {
  comments: (CommentLine | CommentBlock)[];
  key: Identifier | Literal;
  required: boolean;
  type: TSAnyKeyword | TSFunctionType;
};

function createPropertySignature({ comments, key, required, type }: TSType) {
  if (type.type === "TSFunctionType") {
    return j.tsMethodSignature.from({
      comments,
      key,
      optional: !required,
      parameters: type.parameters,
      typeAnnotation: type.typeAnnotation,
    });
  }

  return j.tsPropertySignature.from({
    comments,
    key,
    optional: !required,
    typeAnnotation: j.tsTypeAnnotation(type),
  });
}

function isCustomValidator(path: NodePath) {
  return (
    path.get("type").value === "FunctionExpression" ||
    path.get("type").value === "ArrowFunctionExpression"
  );
}

const resolveRequired = (path: NodePath) =>
  isRequired(path) ? path.get("object") : path;

function getTSType(path: NodePath): any {
  const { value: name } =
    path.get("type").value === "MemberExpression"
      ? path.get("property", "name")
      : path.get("callee", "property", "name");

  switch (name) {
    case "func": {
      const restElement = j.restElement.from({
        argument: j.identifier("args"),
        typeAnnotation: j.tsTypeAnnotation(j.tsArrayType(j.tsUnknownKeyword())),
      });

      return j.tsFunctionType.from({
        parameters: [restElement],
        typeAnnotation: j.tsTypeAnnotation(j.tsUnknownKeyword()),
      });
    }

    case "arrayOf": {
      const type = path.get("arguments", 0);
      return isCustomValidator(type)
        ? j.tsUnknownKeyword()
        : j.tsArrayType(getTSType(resolveRequired(type)));
    }

    case "objectOf": {
      const type = path.get("arguments", 0);
      return isCustomValidator(type)
        ? j.tsUnknownKeyword()
        : j.tsTypeReference(
            j.identifier("Record"),
            j.tsTypeParameterInstantiation([
              j.tsStringKeyword(),
              getTSType(resolveRequired(type)),
            ])
          );
    }

    case "oneOf": {
      const arg = path.get("arguments", 0);

      return arg.get("type").value !== "ArrayExpression"
        ? j.tsArrayType(j.tsUnknownKeyword())
        : j.tsUnionType(
            arg
              .get("elements")
              .value.map(({ type, value }: { type: any; value: any }) => {
                switch (type) {
                  case "StringLiteral":
                    return j.tsLiteralType(j.stringLiteral(value));

                  case "NumericLiteral":
                    return j.tsLiteralType(j.numericLiteral(value));

                  case "BooleanLiteral":
                    return j.tsLiteralType(j.booleanLiteral(value));

                  default:
                    return j.tsUnknownKeyword();
                }
              })
          );
    }

    case "oneOfType":
      return j.tsUnionType(path.get("arguments", 0, "elements").map(getTSType));

    case "instanceOf":
      return j.tsTypeReference(
        j.identifier(path.get("arguments", 0, "name").value)
      );

    case "shape":
    case "exact":
      return j.tsTypeLiteral(
        path
          .get("arguments", 0, "properties")
          .map(mapType)
          .map(createPropertySignature)
      );
  }

  const map = {
    any: j.tsAnyKeyword(),
    array: j.tsArrayType(j.tsUnknownKeyword()),
    bool: j.tsBooleanKeyword(),
    element: j.tsTypeReference(reactType("ReactElement")),
    elementType: j.tsTypeReference(reactType("ElementType")),
    node: j.tsTypeReference(reactType("ReactNode")),
    number: j.tsNumberKeyword(),
    object: j.tsObjectKeyword(),
    string: j.tsStringKeyword(),
    symbol: j.tsSymbolKeyword(),
  } as const;

  return name in map ? map[name as keyof typeof map] : j.tsUnknownKeyword();
}

const isRequired = (path: NodePath) =>
  path.get("type").value === "MemberExpression" &&
  path.get("property", "name").value === "isRequired";

function mapType(path: NodePath): TSType {
  const required = isRequired(path.get("value"));
  const key = path.get("key").value;
  const comments = path.get("leadingComments").value;
  const type = getTSType(
    required ? path.get("value", "object") : path.get("value")
  );

  // If all types should be removed or the type was able to be converted,
  // we remove the type.
  if (options.preservePropTypes !== "all" && type.type !== "TSUnknownKeyword") {
    path.replace();
  }

  return {
    comments: comments ?? [],
    key,
    required,
    type,
  };
}

type CollectedTypes = {
  component: string;
  types: TSType[];
}[];

function getTSTypes(
  source: Collection,
  getComponentName: (path: NodePath) => string
) {
  const collected = [] as CollectedTypes;
  const propertyTypes = ["Property", "ObjectProperty", "ObjectMethod"];

  source
    .filter((path) => path.value)
    .forEach((path) => {
      collected.push({
        component: getComponentName(path),
        types: path
          .filter(
            ({ value }: { value: any }) => propertyTypes.includes(value.type),
            null
          )
          .map(mapType, null),
      });
    });

  return collected;
}

function getFunctionParent(path: NodePath): NodePath {
  return path.parent.get("type").value === "Program"
    ? path
    : getFunctionParent(path.parent);
}

function getComponentName(path: NodePath) {
  const root =
    path.get("type").value === "ArrowFunctionExpression" ? path.parent : path;

  return root.get("id", "name").value ?? root.parent.get("id", "name").value;
}
function createInterface(path: NodePath, componentTypes: CollectedTypes) {
  const componentName = getComponentName(path);
  const types = componentTypes.find((t) => t.component === componentName);
  const typeName = `${componentName}Props`;

  // If the component doesn't have propTypes, ignore it
  if (!types) return;

  // Add the TS types before the function/class
  getFunctionParent(path).insertBefore(
    j.tsInterfaceDeclaration(
      j.identifier(typeName),
      j.tsInterfaceBody(types.types.map(createPropertySignature))
    )
  );

  return typeName;
}
/**
 * If forwardRef is being used, declare the props.
 * Otherwise, return false
 */
function addForwardRefTypes(path: NodePath, typeName: string): boolean {
  // for `React.forwardRef()`
  if (path.node.callee?.property?.name === "forwardRef") {
    path.node.callee.property.name = `forwardRef<HTMLElement, ${typeName}>`;
    return true;
  }
  // if calling `forwardRef()` directly
  if (path.node.callee?.name === "forwardRef") {
    path.node.callee.name = `forwardRef<HTMLElement, ${typeName}>`;
    return true;
  }
  return false;
}

function addFunctionTSTypes(
  source: Collection,
  componentTypes: CollectedTypes
) {
  source.forEach((path) => {
    const typeName = createInterface(path, componentTypes);
    if (!typeName) return;

    // add forwardRef types if present
    if (addForwardRefTypes(path.parentPath, typeName)) return;
    // Function components & Class Components
    // Add the TS types to the props param
    path.get("params", 0).value.typeAnnotation = j.tsTypeReference(
      // For some reason, jscodeshift isn't adding the colon so we have to do
      // that ourselves.
      j.identifier(`: ${typeName}`)
    );
  });
}

function addClassTSTypes(source: Collection, componentTypes: CollectedTypes) {
  source.find(j.ClassDeclaration).forEach((path) => {
    const typeName = createInterface(path, componentTypes);
    if (!typeName) return;

    // Add the TS types to the React.Component super class
    path.value.superTypeParameters = j.tsTypeParameterInstantiation([
      j.tsTypeReference(j.identifier(typeName)),
    ]);
  });
}

function collectPropTypes(source: Collection) {
  return source
    .find(j.AssignmentExpression)
    .filter(
      (path) => path.get("left", "property", "name").value === "propTypes"
    )
    .map((path) => path.get("right", "properties"));
}

function collectStaticPropTypes(source: Collection) {
  return source
    .find(j.ClassProperty)
    .filter((path) => !!path.value.static)
    .filter((path) => path.get("key", "name").value === "propTypes")
    .map((path) => path.get("value", "properties"));
}

function cleanup(
  source: Collection,
  propTypes: Collection,
  staticPropTypes: Collection
) {
  propTypes.forEach((path) => {
    if (!path.parent.get("right", "properties", "length").value) {
      path.parent.prune();
    }
  });

  staticPropTypes.forEach((path) => {
    if (!path.parent.get("value", "properties", "length").value) {
      path.parent.prune();
    }
  });

  const propTypesUsages = source
    .find(j.MemberExpression)
    .filter((path) => path.get("object", "name").value === "PropTypes");

  // We can remove the import without caring about the preserve-prop-types
  // option since the criteria for removal is that no PropTypes.* member
  // expressions exist.
  if (propTypesUsages.length === 0) {
    source
      .find(j.ImportDeclaration)
      .filter((path) => path.value.source.value === "prop-types")
      .remove();
  }
}

const isOnlyWhitespace = (str: string) => !/\S/.test(str);

/**
 * Guess the tab width of the file. This file is a modified version of recast's
 * built-in tab width guessing with a modification to better handle files with
 * block comments.
 * @see https://github.com/benjamn/recast/blob/8cc1f42408c41b5616d82574f5552c2da3e11cf7/lib/lines.ts#L280-L314
 */
function guessTabWidth(source: string) {
  const lines = source.split("\n");
  const counts: number[] = [];
  let lastIndent = 0;

  for (const line of lines) {
    // Whitespace-only lines don't tell us much about the likely tab width
    if (isOnlyWhitespace(line)) {
      continue;
    }

    // Calculate the indentation of the line excluding lines starting with an
    // asterisk. This is because these lines are often part of block comments
    // which are indented an extra space which throws off our tab width guessing.
    const indent = line.match(/^(\s*)/)
      ? line.trim().startsWith("*")
        ? lastIndent
        : RegExp.$1.length
      : 0;

    const diff = Math.abs(indent - lastIndent);
    counts[diff] = ~~(counts[diff] ?? 0) + 1;
    lastIndent = indent;
  }

  let maxCount = -1;
  let result = 2;

  // Loop through the counts array to find the most common tab width in the file
  for (let tabWidth = 1; tabWidth < counts.length; tabWidth++) {
    const count = counts[tabWidth];
    if (count !== undefined && count > maxCount) {
      maxCount = count;
      result = tabWidth;
    }
  }

  return result;
}

// Use the TSX to allow parsing of TypeScript code that still contains prop
// types. Though not typical, this exists in the wild.
export const parser = "tsx";

export default function transform(file: FileInfo, api: API, opts: Options) {
  j = api.jscodeshift;
  const source = j(file.source);

  // Parse the CLI options
  options = {
    preservePropTypes:
      opts["preserve-prop-types"] === true
        ? "all"
        : opts["preserve-prop-types"] || "none",
  };

  const propTypes = collectPropTypes(source);

  const tsTypes = getTSTypes(
    propTypes,
    (path) => path.parent.get("left", "object", "name").value
  );

  const staticPropTypes = collectStaticPropTypes(source);

  if (propTypes.length === 0 && staticPropTypes.length === 0) {
    return undefined;
  }

  const staticTSTypes = getTSTypes(
    staticPropTypes,
    (path) => path.parent.parent.parent.value.id.name
  );

  addFunctionTSTypes(source.find(j.FunctionDeclaration), tsTypes);
  addFunctionTSTypes(source.find(j.FunctionExpression), tsTypes);
  addFunctionTSTypes(source.find(j.ArrowFunctionExpression), tsTypes);
  addClassTSTypes(source, tsTypes);
  addClassTSTypes(source, staticTSTypes);

  if (options.preservePropTypes === "none") {
    propTypes.remove();
    staticPropTypes.remove();
  }

  // Remove empty propTypes expressions and imports
  cleanup(source, propTypes, staticPropTypes);

  return source.toSource({ tabWidth: guessTabWidth(file.source) });
}
