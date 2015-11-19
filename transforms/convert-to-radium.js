/**
 * Remove classnames module import
 * Convert classnames to inline styles
 * @param file
 * @param api
 * @return {string}
 */

const path = require("path");
const resolve = require("resolve");

const mediaQueries = ["min-width", "minWidth", "max-width", "maxWidth"];
const options = require("./util/options");

module.exports = function (file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);
    var styles = null;

    const resolveOptions = {
        paths: [],
        basedir: path.dirname(file.path),
        extensions: [".js"],
        moduleDirectory: path.dirname(file.path)
    };

    const getAttribute = function (attrName, attributes) {
        const attrs = attributes.filter(function (attribute) {
            if (!attribute.name) {
                return false;
            }

            return attribute.name.name === attrName;
        });

        return attrs[0] || null;
    };


    const getClassAttribute = function (attributes) {
        return getAttribute("className", attributes);
    };

    const getStyleAttribute = function (attributes) {
        return getAttribute("style", attributes);
    };

    const getKeyAttribute = function (attributes) {
        return getAttribute("key", attributes);
    };

    const logError = function (attr) {
        if (attr.loc && attr.loc.start) {
            const line = attr.loc.start.line;
            console.error("%s: Could not update styles on line %s", file.path, line);
        }
    };


    const isInteractiveStyle = function (style) {
        if (!style) {
            return false;
        }

        if (style[":hover"]) {
            return true;
        }

        for (var prop in style) {
            if (style.hasOwnProperty(prop)) {
                for (var query in mediaQueries) {
                    if (prop.indexOf(mediaQueries[query]) > -1) {
                        return true;
                    }
                }
            }
        }

        return false;
    };


    const getInteractiveKey = function (expressions) {
        for (var expression in expressions) {
            if (expressions[expression].type !== "MemberExpression") {
                continue;
            }

            if (expressions[expression].object.name === "styles") {
                const style = expressions[expression].property.name;
                if (isInteractiveStyle(styles[style])) {
                    return style;
                }
            }
        }

        return null;
    };


    const createStyleAttribute = function (styleObjects) {
        if (styleObjects.length === 0) {
            return null;
        }

        var styleValue = null;
        if (styleObjects.length > 1) {
            const spreadObjects = styleObjects.map(function (style) {
                return j.spreadProperty(style);
            });
            styleValue = j.objectExpression(spreadObjects);
        } else {
            styleValue = styleObjects[0];
        }

        return j.jsxAttribute(
            j.jsxIdentifier("style"),
            j.jsxExpressionContainer(styleValue)
        );
    };


    const createClassAttribute = function (classes) {
        return j.jsxAttribute(
            j.jsxIdentifier("className"),
            j.literal(classes)
        );
    };


    const applyClassesAndStyles = function (attrs, allStyles) {
        const stringArgs = allStyles.filter(function (style) {
            return style.type === "Literal";
        }).map(function (style) {
            return style.value;
        }).join(" ");

        const objArgs = allStyles.filter(function (style) {
            return style.type !== "Literal";
        });

        if (objArgs.length) {
            const styleAttribute = createStyleAttribute(objArgs);
            attrs.push(styleAttribute);
        }

        if (stringArgs.length) {
            const classAttribute = createClassAttribute(stringArgs);
            attrs.push(classAttribute);
        }

        const interactiveKey = styles && getInteractiveKey(objArgs);
        if (interactiveKey && !getKeyAttribute(attrs)) {
            const keyAttribute = j.jsxAttribute(
                j.jsxIdentifier("key"),
                j.literal(interactiveKey)
            );
            attrs.push(keyAttribute);
        }
    };


    const updateStyles = function (p) {
        const attrs = p.value.attributes;
        const classAttribute = getClassAttribute(attrs);
        const styleAttribute = getStyleAttribute(attrs);

        const classValue = classAttribute.value;

        if (classValue.expression && classValue.expression.type === "CallExpression") {
            const conditionalStyles = classValue.expression.arguments.filter(function (arg) {
                return (arg.type === "ObjectExpression");
            });

            if (conditionalStyles.length) {
                logError(classAttribute);
                return;
            }
        }

        var allStyles = [];
        if (classValue.type === "Literal") {
            allStyles.push(classValue);
        } else if (classValue.expression.type === "CallExpression") {
            allStyles = allStyles.concat(classValue.expression.arguments);
        } else {
            allStyles.push(classValue.expression);
        }

        if (classAttribute) {
            attrs.splice(attrs.indexOf(classAttribute), 1);
        }

        if (styleAttribute) {
            attrs.splice(attrs.indexOf(styleAttribute), 1);
            allStyles.push(styleAttribute.value.expression);
        }

        applyClassesAndStyles(attrs, allStyles);
    };


    const radiumImport = j.importDeclaration(
        [j.importDefaultSpecifier(
            j.identifier("radium")
        )],
        j.literal("react-wildcat-radium")
    );


    root
        .find(j.ImportDeclaration, {
            specifiers: [{
                local: {
                    name: "styles"
                }
            }]
        }).forEach(function (p) {
            const styleImport = p.value.source.value;
            const absoluteImportPath = resolve.sync(styleImport, resolveOptions);

            try {
                if (p.value.specifiers[0].type === "ImportDefaultSpecifier") {
                    styles = require(absoluteImportPath);
                } else {
                    styles = require(absoluteImportPath).styles;
                }
            } catch (e) {
                console.error("%s: Could not import styles, you will need to add key attributes " +
                                "manually to any elements with interactive styles", file.path);
            }
        });


    root
        .find(j.ImportDeclaration, {
            source: {
                type: "Literal",
                value: "react"
            }
        }).forEach(function (p) {
            j(p).insertAfter(radiumImport);
        });


    root
        .find(j.ImportDeclaration, {
            source: {
                type: "Literal",
                value: "classnames"
            }
        }).forEach(function (p) {
            j(p).replaceWith("");
        });

    root
        .find(j.JSXOpeningElement)
        .filter(function (p) {
            const attrs = p.value.attributes;
            return getClassAttribute(attrs) !== null;
        }).forEach(function (p) {
            updateStyles(p);
        });

    root
        .find(j.ClassDeclaration, {
            superClass: {
                object: {
                    name: "React"
                },
                property: {
                    name: "Component"
                }
            }
        }).forEach(function (p) {
            const hasStyles = root
                .find(j.JSXOpeningElement, {
                    attributes: [{
                        name: {
                            name: "style"
                        }
                    }]
                });

            if (hasStyles.__paths.length) {
                if (!p.node.decorators) {
                    p.node.decorators = [];
                }

                p.node.decorators.push(
                    j.decorator(
                        j.identifier("radium")
                    )
                );
            }
        });

    return root.toSource(options);
};
