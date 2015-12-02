const toSource = require("./util/to-source");

module.exports = function (file, api) {
    var forceDecorators = false;

    const j = api.jscodeshift;
    const root = j(file.source);

    const filterImport = function (remove, imports) {
        return imports.filter(function (imp) {
            return imp.imported.name !== remove;
        });
    };

    // First, find and remove RouteHandler imports
    root.find(j.ImportDeclaration, {
        source: {
            type: "Literal",
            value: "react-router"
        },
        specifiers: [{
            imported: {
                name: "RouteHandler"
            }
        }]
    }).forEach(function (p) {
        p.value.specifiers = filterImport("RouteHandler", p.value.specifiers);
        if (!p.value.specifiers.length) {
            j(p).remove();
            forceDecorators = true;
        }
    });

    // Next, find all class declarations
    root
        .find(j.ClassDeclaration)
        .forEach(function (c) {
            // Set to true if we need propTypes
            var assignChildlessConstant = false;
            var addPropTypes = false;

            // Find all <RouteHandler /> elements
            j(c).find(j.JSXOpeningElement, {
                type: "JSXOpeningElement",
                name: {
                    type: "JSXIdentifier",
                    name: "RouteHandler"
                }
            }).forEach(function (p) {
                // Get all of the RouteHandler's attributes...
                const attributeMap = p.node.attributes
                    // ...and remap them into object properties
                    .map(function (a) {
                        // Simple attributes become properties
                        if (a.type === "JSXAttribute") {
                            var unwrappedValue = a.value;

                            // Walk the attribute in case it is wrapped in a JSX container
                            while (unwrappedValue.type === "JSXExpressionContainer") {
                                unwrappedValue = unwrappedValue.expression;
                            }

                            return j.property(
                                "init",
                                a.name,
                                unwrappedValue
                            );
                        }

                        // Spread attributes become spread properties
                        if (a.type === "JSXSpreadAttribute") {
                            // ...this.props attributes must get stripped of its "children" prop
                            // as they cannot be overwritten downstream
                            if (
                                a.argument.type === "MemberExpression" &&
                                a.argument.object.type === "ThisExpression" &&
                                a.argument.property.name === "props"
                            ) {
                                // Flag that we need a new variable declaration
                                assignChildlessConstant = true;

                                // here we are converting ...this.props -> ...props
                                return j.spreadProperty(
                                    j.identifier(a.argument.property.name)
                                );
                            }

                            return j.spreadProperty(
                                a.argument
                            );
                        }
                    })
                    .filter(function (a) {
                        return a;
                    });

                // Replace <RouteHandler /> with {React.cloneElement(this.props.children)}
                p.replace(
                    j.jsxExpressionContainer(
                        attributeMap.length ? j.callExpression(
                            j.identifier("React.cloneElement"),
                            [
                                j.identifier(
                                    assignChildlessConstant ? "children" : "this.props.children"
                                ),
                                j.objectExpression(attributeMap)
                            ]
                        ) : j.identifier("this.props.children")
                    )
                );

                // Now we want to add static propTypes
                addPropTypes = true;
            });

            if (assignChildlessConstant) {
                const prop = j.property(
                    "init",
                    j.identifier("children"),
                    j.identifier("children")
                );

                prop.shorthand = true;

                const childlessConstant = j.variableDeclaration(
                    "const",
                    [
                        j.variableDeclarator(
                            j.objectPattern([
                                prop,
                                j.spreadProperty(
                                    j.identifier("props")
                                )
                            ]),
                            j.identifier("this.props")
                        )
                    ]
                );

                // Append the static to our class body
                j(c)
                    .find(j.ClassBody)
                    .find(j.MethodDefinition, {
                        key: {
                            name: "render"
                        }
                    })
                    .map(function (m) {
                        return m.get("value");
                    })
                    .forEach(function (b) {
                        b.value.body.body.unshift(childlessConstant);
                    });
            }

            if (addPropTypes) {
                // Create our propType for later use
                const childrenPropType = j.property(
                    "init",
                    j.identifier("children"),
                    j.identifier("React.PropTypes.node")
                );

                // Look for existing propType static
                const existingPropTypes = j(c)
                    .find(j.ClassProperty, {
                        key: {
                            type: "Identifier",
                            name: "propTypes"
                        },
                        value: {
                            type: "ObjectExpression"
                        },
                        static: true
                    });

                // If any are found...
                if (existingPropTypes.paths().length) {
                    // ...look for a children propType
                    const existingChildrenPropType = existingPropTypes.find(j.Property, {
                        kind: "init",
                        key: {
                            name: "children"
                        }
                    });

                    // If no children propType...
                    if (!existingChildrenPropType.paths().length) {
                        // Add one to the existing static
                        existingPropTypes.get()
                            .value
                            .value
                            .properties
                            .push(childrenPropType);
                    }

                // If no propType static...
                } else {
                    // ...then create the static
                    const staticMember = j.classProperty(
                        j.identifier("propTypes"),
                        j.objectExpression([
                            childrenPropType
                        ]),
                        null,
                        true
                    );

                    // Append the static to our class body
                    j(c)
                        .find(j.ClassBody)
                        .forEach(function (b) {
                            b.value.body.unshift(staticMember);
                        });
                }
            }
        });

    return toSource(root, j, forceDecorators);
};
