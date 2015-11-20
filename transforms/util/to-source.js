const options = require("./options");
const _ = require("underscore");

module.exports = function (root, j, forceDecorators) {
    if (!forceDecorators) {
        return root.toSource(options);
    }

    // workaround the missing decorator issue
    // https://github.com/facebook/jscodeshift/issues/70
    root
        .find(j.ClassDeclaration)
            .forEach(function (p) {
                const existingDecorators = _.uniq(p.node.decorators, function (d) {
                    return d.expression.callee ? d.expression.callee.name : d.expression.name;
                });

                p.node.decorators = [
                    j.decorator(
                        j.identifier("dummy")
                    )
                ]
                    .concat(existingDecorators);
            });

    // Strip out the dummy decorator
    return root.toSource(options).replace(/@dummy\n/g, "");
};
