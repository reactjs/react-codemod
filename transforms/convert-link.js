const toSource = require("./util/to-source");
const formatError = require("./util/format-error");

module.exports = function (file, api) {
    var addImport = false;
    var forceDecorators = false;

    const j = api.jscodeshift;
    const root = j(file.source);

    const getUnwrappedValue = function (expr) {
        var unwrappedValue = expr.get("value").value;

        // Walk the attribute in case it is wrapped in a JSX container
        while (unwrappedValue.type === "JSXExpressionContainer") {
            unwrappedValue = unwrappedValue.expression;
        }

        return unwrappedValue;
    };

    const getArguments = function (to, params) {
        var args = [
            getUnwrappedValue(to)
        ];

        if (params) {
            args = args.concat([
                getUnwrappedValue(params)
            ]);
        }

        return args;
    };

    root
        .find(j.ClassDeclaration)
        .forEach(function (c) {
            j(c)
                .find(j.JSXOpeningElement, {
                    type: "JSXOpeningElement",
                    name: {
                        type: "JSXIdentifier",
                        name: "Link"
                    }
                })
                .forEach(function (p) {
                    try {
                        addImport = true;

                        const attrs = p
                            .get("attributes");

                        const to = attrs
                            .filter(function (a) {
                                return a.get("name").get("name").value === "to";
                            })
                            .pop();

                        const params = attrs
                            .filter(function (a) {
                                return a.get("name").get("name").value === "params";
                            })
                            .pop();

                        const routeHelper = j.jsxExpressionContainer(
                            j.callExpression(
                                j.identifier("route.for"),
                                getArguments(to, params)
                            )
                        );

                        if (params) {
                            params.prune();
                        }

                        to.get("value").replace(routeHelper);
                    } catch (e) {
                        formatError(
                            file.path,
                            "One or more <Link> elements found in this file could not be properly migrated."
                        );
                    }
                });
        });

    if (addImport) {
        forceDecorators = true;

        root
            .find(j.ImportDeclaration, {
                source: {
                    type: "Literal",
                    value: "react-router"
                },
                specifiers: [{
                    imported: {
                        name: "Link"
                    }
                }]
            })
            .insertBefore(
                j.importDeclaration(
                    [j.importSpecifier(
                        j.identifier("routeHelper"),
                        j.identifier("route")
                    )],
                    j.literal("addons/RouteHelper.js")
                )
            );
    }

    return toSource(root, j, forceDecorators);
};

