'use strict'

module.exports = (file, api, options) => {
  const j = api.jscodeshift

  return j(file.source)
    .find(j.CallExpression, {
      callee: {
        object: {
          name: 'console',
        },
        property: {
          name: 'log',
        },
      },
    })
    .forEach((path) => {
      path.node.callee.property.name = 'warn'
    })
    .toSource()
}
