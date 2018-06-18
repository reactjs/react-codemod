/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

module.exports = function (file, api, options) {
    const j = api.jscodeshift;
    const root = j(file.source);
    const ReactUtils = require('./utils/ReactUtils')(j);
    const encodeJSXTextValue = value =>
        value
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

    const canLiteralBePropString = node =>
        node.raw.indexOf('\\') === -1 &&
        node.value.indexOf('"') === -1;

    const convertExpressionToJSXAttributes = (expression) => {
        if (!expression) {
            return {
                attributes: [],
                extraComments: [],
            };
        }

        const isReactSpread = expression.type === 'CallExpression' &&
            expression.callee.type === 'MemberExpression' &&
            expression.callee.object.name === 'React' &&
            expression.callee.property.name === '__spread';

        const isObjectAssign = expression.type === 'CallExpression' &&
            expression.callee.type === 'MemberExpression' &&
            expression.callee.object.name === 'Object' &&
            expression.callee.property.name === 'assign';

        const validSpreadTypes = [
            'Identifier',
            'MemberExpression',
            'CallExpression',
        ];

        if (isReactSpread || isObjectAssign) {
            const resultAttributes = [];
            const resultExtraComments = expression.comments || [];
            const {callee} = expression;
            for (const node of [callee, callee.object, callee.property]) {
                resultExtraComments.push(...(node.comments || []));
            }
            expression.arguments.forEach((expression) => {
                const {attributes, extraComments} = convertExpressionToJSXAttributes(expression);
                resultAttributes.push(...attributes);
                resultExtraComments.push(...extraComments);
            });

            return {
                attributes: resultAttributes,
                extraComments: resultExtraComments,
            };
        } else if (validSpreadTypes.indexOf(expression.type) != -1) {
            return {
                attributes: [j.jsxSpreadAttribute(expression)],
                extraComments: [],
            };
        } else if (expression.type === 'ObjectExpression') {
            const attributes = expression.properties.map((property) => {
                if (property.type === 'SpreadProperty') {
                    const spreadAttribute = j.jsxSpreadAttribute(property.argument);
                    spreadAttribute.comments = property.comments;
                    return spreadAttribute;
                } else if (property.type === 'Property') {
                    const propertyValueType = property.value.type;

                    let value;
                    if (propertyValueType === 'Literal' &&
                        typeof property.value.value === 'string' &&
                        canLiteralBePropString(property.value)) {
                        value = j.literal(property.value.value);
                        value.comments = property.value.comments;
                    } else {
                        value = j.jsxExpressionContainer(property.value);
                    }

                    let jsxIdentifier;
                    if (property.key.type === 'Literal') {
                        jsxIdentifier = j.jsxIdentifier(property.key.value);
                    } else {
                        jsxIdentifier = j.jsxIdentifier(property.key.name);
                    }
                    jsxIdentifier.comments = property.key.comments;

                    const jsxAttribute = j.jsxAttribute(
                        jsxIdentifier,
                        value
                    );
                    jsxAttribute.comments = property.comments;
                    return jsxAttribute;
                }
                return null;
            });

            return {
                attributes,
                extraComments: expression.comments || [],
            };
        } else if (expression.type === 'Literal' && expression.value === null) {
            return {
                attributes: [],
                extraComments: expression.comments || [],
            };
        } else if (expression.type === 'ArrayExpression') {
            console.log('yp;o');

        } else {
            throw new Error(`Unexpected attribute of type "${expression.type}"`);
        }
    };

    const canConvertToJSXIdentifier = node =>
        (node.type === 'Literal' && typeof node.value === 'string') ||
        node.type === 'Identifier' ||
        (node.type === 'MemberExpression' && !node.computed &&
            canConvertToJSXIdentifier(node.object) && canConvertToJSXIdentifier(node.property));

    const jsxIdentifierFor = node => {
        let identifier;
        let comments = node.comments || [];
        if (node.type === 'Literal') {
            identifier = j.jsxIdentifier(node.value);
        } else if (node.type === 'MemberExpression') {
            let {
                identifier: objectIdentifier,
                comments: objectComments
            } = jsxIdentifierFor(node.object);
            let {
                identifier: propertyIdentifier,
                comments: propertyComments
            } = jsxIdentifierFor(node.property);
            identifier = j.jsxMemberExpression(objectIdentifier, propertyIdentifier);
            comments.push(...objectComments, ...propertyComments);
        } else {
            identifier = j.jsxIdentifier(node.name);
        }
        return {identifier, comments};
    };

    const isCapitalizationInvalid = (node) =>
        (node.type === 'Literal' && !/^[a-z]/.test(node.value)) ||
        (node.type === 'Identifier' && /^[a-z]/.test(node.name));

    const convertArrayExpressionToJSX = (nodes) => {
        return nodes.slice(0).map((child, index) => {
            child.value = child.callee;
            return convertNodeToJSX(child);
        });

    };

    const convertNodeToJSX = (node) => {
        const comments = node.value && node.value.comments || [];
        const {callee} = node.value;

        let args;

        if (node.value && node.value.arguments) {
            args = node.value.arguments;
        } else {
            args = node.arguments;
        }

        if (!args[2] && args[1] && args[1].type === "ArrayExpression") {
            args[2] = args[1];
            args[1] = j.nullLiteralTypeAnnotation();
        }
        if (args[2] && args[2].elements && args[2].type) {
            args = [args[0], args[1]].concat(args[2].elements);
        }


        if (isCapitalizationInvalid(args[0]) || !canConvertToJSXIdentifier(args[0]) && node.value.type !== 'ArrayExpression') {
            return node.value;
        }

        const {
            identifier: jsxIdentifier,
            comments: identifierComments
        } = jsxIdentifierFor(args[0]);
        const props = args[1];

        const {attributes, extraComments} = convertExpressionToJSXAttributes(props);

        for (const comment of [...identifierComments, ...extraComments]) {
            comment.leading = false;
            comment.trailing = true;
            comments.push(comment);
        }

        const children = args.slice(2).map((child, index) => {
            if (child.type === 'Literal' &&
                typeof child.value === 'string' &&
                !child.comments &&
                child.value !== '' &&
                child.value.trim() === child.value) {
                return j.jsxText(encodeJSXTextValue(child.value));
            } else if (child.type === 'CallExpression' &&
                child.callee &&
                child.callee.name === 'h') {
                let jsxChild;
                if (!child.value) {
                    child.value = child.callee;
                    jsxChild = convertNodeToJSX(child);
                } else {
                    jsxChild = convertNodeToJSX(child);
                }
                if (jsxChild.type !== 'JSXElement' || (jsxChild.comments || []).length > 0) {
                    return j.jsxExpressionContainer(jsxChild);
                } else {
                    return jsxChild;
                }
            } else if (child.type === 'ArrayExpression') {
                if (!child.value) {
                    child.value = child;
                }
                return convertArrayExpressionToJSX(child.value.elements);
            } else if (child.type === 'SpreadElement') {
                return j.jsxExpressionContainer(child.argument);
            } else {
                return j.jsxExpressionContainer(child);
            }
        });

        const openingElement = j.jsxOpeningElement(jsxIdentifier, attributes);

        if (children.length) {
            const endIdentifier = Object.assign({}, jsxIdentifier, {comments: []});
            // Add text newline nodes between elements so recast formats one child per
            // line instead of all children on one line.
            const paddedChildren = [j.jsxText('\n')];
            for (const child of children) {
                paddedChildren.push(child, j.jsxText('\n'));
            }
            const element = j.jsxElement(
                openingElement,
                j.jsxClosingElement(endIdentifier),
                paddedChildren
            );
            element.comments = comments;
            return element;
        } else {
            openingElement.selfClosing = true;
            const element = j.jsxElement(openingElement);
            element.comments = comments;
            return element;
        }
    };

    if (
        // options['explicit-require'] === false ||
    // ReactUtils.hasReact(root)
        true
    ) {
        const mutations = root
            .find(j.CallExpression, {
                callee: {
                    name: 'h',
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
