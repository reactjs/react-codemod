/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

"use strict";

export default (file, api, options) => {
  const j = api.jscodeshift;

  const printOptions = options.printOptions || {
    quote: "single",
    trailingComma: true,
  };

  const root = j(file.source);

  let hasModifications = false;

  root
    .find(j.JSXAttribute, (node) => {
      return node.name.name === "ref";
    })
    .forEach((jsxAttributePath) => {
      const valuePath = jsxAttributePath.get("value");
      if (
        // Flow parser
        valuePath.value.type === "Literal" ||
        // TSX parser
        valuePath.value.type === "StringLiteral"
      ) {
        hasModifications = true;
        // This might shadow existing variables.
        // But this should be safe since we control what identifiers we're reading in this block.
        // It will trigger ESLint's `no-shadow` though.
        // Babel has a helper to get a identifier that doesn't shadow existing vars.
        // Maybe JSCodeShift has such a helper as well?
        const currentIdentifierName = "current";
        valuePath.replace(
          // {(current) => {}}
          j.jsxExpressionContainer(
            j.arrowFunctionExpression(
              [j.identifier(currentIdentifierName)],
              j.blockStatement([
                // if (process.env.NODE_ENV !== 'production')
                j.ifStatement(
                  j.binaryExpression(
                    "!==",
                    j.memberExpression(
                      j.memberExpression(
                        j.identifier("process"),
                        j.identifier("env")
                      ),
                      j.identifier("NODE_ENV")
                    ),
                    j.stringLiteral("production")
                  ),
                  j.blockStatement([
                    // if (Object.isSealed(this.refs))
                    j.ifStatement(
                      j.callExpression(
                        j.memberExpression(
                          j.identifier("Object"),
                          j.identifier("isSealed")
                        ),
                        [
                          j.memberExpression(
                            j.thisExpression(),
                            j.identifier("refs")
                          ),
                        ]
                      ),
                      j.blockStatement([
                        // this.refs = {}
                        j.expressionStatement(
                          j.assignmentExpression(
                            "=",
                            j.memberExpression(
                              j.thisExpression(),
                              j.identifier("refs")
                            ),
                            j.objectExpression([])
                          )
                        ),
                      ])
                    ),
                  ])
                ),
                // this.refs[valuePath.node.value] = current
                j.expressionStatement(
                  j.assignmentExpression(
                    "=",
                    j.memberExpression(
                      j.memberExpression(
                        j.thisExpression(),
                        j.identifier("refs")
                      ),
                      j.literal(valuePath.node.value)
                    ),
                    j.identifier(currentIdentifierName)
                  )
                ),
              ])
            )
          )
        );
      }
    });

  return hasModifications ? root.toSource(printOptions) : file.source;
};
