/**
 * Remove classnames module import
 * Convert classnames to inline styles
 * @param file
 * @param api
 * @return {string}
 */

module.exports = function (file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);


    const getAttribute = (attrName, attributes) => {
        const attrs = attributes.filter(attribute => {
            return attribute.name.name === attrName;
        });

        return attrs[0] || null;
    };


    const getClassAttribute = (attributes) => getAttribute("className", attributes);
    const getStyleAttribute = (attributes) => getAttribute("style", attributes);


    const logError = (attr) => {
        const line = attr.loc.start.line;
        console.log(`${file.path}: Could not update styles on line ${line}`);
    };


    const createStyleAttribute = (styleObjects) => {
        if (styleObjects.length === 0) {
            return null;
        }

        let styleValue = null;
        if (styleObjects.length > 1) {
            const emptyObject = j.objectExpression([]);
            styleObjects.unshift(emptyObject);

            const objectAssign = j.memberExpression(
                j.identifier("Object"),
                j.identifier("assign")
            );
            styleValue = j.callExpression(objectAssign, [...styleObjects]);
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
        .find(j.JSXOpeningElement, {
            attributes: [{
                name: {
                    name: "className"
                }
            }]
        }).forEach(p => {
            updateStyles(p);
        });

    return root.toSource();
};
