/**
 * Remove classnames module import
 * Convert classnames to inline styles
 * @param file
 * @param api
 * @return {string}
 */

import path from "path";
import resolve from "resolve";

const mediaQueries = ["min-width", "minWidth", "max-width", "maxWidth"];

module.exports = function (file, api, options) {
    const j = api.jscodeshift;
    const root = j(file.source);
    let styles = null;

    const resolveOptions = {
        paths: [],
        basedir: path.dirname(file.path),
        extensions: [".js"],
        moduleDirectory: path.dirname(file.path)
    };

    const getAttribute = (attrName, attributes) => {
        const attrs = attributes.filter(attribute => {
            return attribute.name.name === attrName;
        });

        return attrs[0] || null;
    };


    const getClassAttribute = (attributes) => getAttribute("className", attributes);
    const getStyleAttribute = (attributes) => getAttribute("style", attributes);
    const getKeyAttribute = (attributes) => getAttribute("key", attributes);


    const logError = (attr) => {
        const line = attr.loc.start.line;
        console.error(`${file.path}: Could not update styles on line ${line}`);
    };


    const isInteractiveStyle = (style) => {
        if (!style) {
            return false;
        }

        if (style[":hover"]) {
            return true;
        }

        for (const prop in style) {
            if (style.hasOwnProperty(prop)) {
                for (const query of mediaQueries) {
                    if (prop.indexOf(query) > -1) {
                        return true;
                    }
                }
            }
        }

        return false;
    };


    const getInteractiveKey = (expressions) => {
        for (const expression of expressions) {
            if (expression.type !== "MemberExpression") {
                continue;
            }

            if (expression.object.name === "styles") {
                const style = expression.property.name;
                if (isInteractiveStyle(styles[style])) {
                    return style;
                }
            }
        }

        return null;
    };


    const createStyleAttribute = (styleObjects) => {
        if (styleObjects.length === 0) {
            return null;
        }

        let styleValue = null;
        if (styleObjects.length > 1) {
            const spreadObjects = styleObjects.map(style => {
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


    const createClassAttribute = (classes) => {
        return j.jsxAttribute(
            j.jsxIdentifier("className"),
            j.literal(classes)
        );
    };


    const applyClassesAndStyles = (attrs, allStyles) => {
        const stringArgs = allStyles.filter(style => {
            return style.type === "Literal";
        }).map(style => style.value).join(" ");

        const objArgs = allStyles.filter(style => {
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


    const updateStyles = (p) => {
        const attrs = p.value.attributes;
        const classAttribute = getClassAttribute(attrs);
        const styleAttribute = getStyleAttribute(attrs);
        const classValue = classAttribute.value;

        if (classValue.expression && classValue.expression.type === "CallExpression") {
            const conditionalStyles = classValue.expression.arguments.filter(arg => {
                return (arg.type === "ObjectExpression");
            });

            if (conditionalStyles.length) {
                logError(classAttribute);
                return;
            }
        }

        let allStyles = [];
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
        }).forEach(p => {
            const styleImport = p.value.source.value;
            const absoluteImportPath = resolve.sync(styleImport, resolveOptions);

            if (p.value.specifiers[0].type === "ImportDefaultSpecifier") {
                styles = require(absoluteImportPath);
            } else {
                styles = require(absoluteImportPath).styles;
            }
        });


    root
        .find(j.ImportDeclaration, {
            source: {
                type: "Literal",
                value: "react"
            }
        }).forEach(p => {
            j(p).insertAfter(radiumImport);
        });


    root
        .find(j.ImportDeclaration, {
            source: {
                type: "Literal",
                value: "classnames"
            }
        }).forEach(p => {
            j(p).replaceWith("");
        });

    root
        .find(j.JSXOpeningElement)
        .filter(p => {
            const attrs = p.value.attributes;
            return getClassAttribute(attrs) !== null;
        }).forEach(p => {
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
        }).forEach(p => {
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
