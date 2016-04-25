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

module.exports = function(file, api, options) {

  const itemsToNotSuffixWithPx = new Set([
    'animationIterationCount',
    'boxFlex',
    'boxFlexGroup',
    'boxOrdinalGroup',
    'columnCount',
    'fillOpacity',
    'flex',
    'flexGrow',
    'flexPositive',
    'flexShrink',
    'flexNegative',
    'flexOrder',
    'fontWeight',
    'lineClamp',
    'lineHeight',
    'opacity',
    'order',
    'orphans',
    'stopOpacity',
    'strokeDashoffset',
    'strokeOpacity',
    'strokeWidth',
    'tabSize',
    'widows',
    'zIndex',
    'zoom',
  ]);

  if (options.ignore) {
    const toIgnore = options.ignore.split(',');
    if (toIgnore.length) {
      toIgnore.forEach(i => itemsToNotSuffixWithPx.add(i));
    }
  }
  const transformNumbers = options.transformNumbers;
  const printOptions = options.printOptions || {};
  const j = api.jscodeshift;
  const root = j(file.source);

  const shouldSuffixIfIntergerValue = attr => !itemsToNotSuffixWithPx.has(attr);
  const doesNeedSuffix = val => {
    if (typeof val === 'string') {
      const isNumString = !isNaN(Number(val));
      return isNumString && !val.includes('px');
    }
    return transformNumbers && typeof val === 'number'; 
  };
  const getStyle = attrs => attrs.find(attr => attr.name && attr.name.name === 'style');

  function transformProperties(props) {
    props.forEach(p => {
      if (p.type === 'SpreadProperty') {
        transformStyleObject(p.argument, root);
      } else {
        const key = p.key.type === 'Identifier' ? p.key.name : p.key.value;
        let val = p.value.value;
        if (val === undefined) {
          if (transformNumbers && p.value.type === 'UnaryExpression') {
            val = parseInt(`${p.value.operator}${p.value.argument.value}`, 10); 
            if (shouldSuffixIfIntergerValue(key) && doesNeedSuffix(val)) {
              p.value.operator = '';
              p.value.argument.value = `${val}px`;
            }  
            return;
          }
        }
        if (shouldSuffixIfIntergerValue(key) && doesNeedSuffix(val)) {
          p.value.value = `${val}px`;
        }
      }
    });
  }

  function transformConditional(o) {
    const consequent = o.consequent;
    const alternate = o.alternate;
    if (consequent) {
      if (consequent.type === 'ObjectExpression' && consequent.properties) {
        transformProperties(consequent.properties, root);
      } else if (consequent.type === 'Identifier') {
        transformStyleObject(consequent, root);
      }
    } 
    if (alternate) {
      if (alternate.type === 'ObjectExpression' && alternate.properties) {
        transformProperties(alternate.properties, root);
      } else if (alternate.type === 'Identifier') {
        transformStyleObject(alternate, root);
      }
    } 
  }

  function transformStyleObject(style) {
    const type = style.type;
    if (type === 'Identifier') {
      const varName = style.name;
      root.findVariableDeclarators(varName).forEach(o => {
        let properties;
        const type = o.value.init.type;
        if (type === 'ObjectExpression') {
          properties = o.value.init.properties;
        } else if (type === 'ConditionalExpression') {
          transformConditional(o.value.init, root);
        } else if (type === 'CallExpression' &&  o.value.init.callee.property.name === 'assign') {
          o.value.init.arguments.forEach(arg => transformStyleObject(arg, root));
        }
        if (properties) {
          transformProperties(properties, root);
        }
      }); 
    } else if (type === 'ObjectExpression') {
      const properties = style.properties;
      if (properties) {
        transformProperties(properties);
      }
    } else if (type === 'ConditionalExpression') {
      transformConditional(style, root);
    }
  } 

  root.find(j.JSXOpeningElement).forEach(el => {
    const style = getStyle(el.value.attributes);
    if (style) {
      transformStyleObject(style.value.expression, root);
    }
  });
  return root.toSource(printOptions);
};
