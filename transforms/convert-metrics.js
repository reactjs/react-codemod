const toSource = require("./util/to-source");

module.exports = function (file, api) {
    var j = api.jscodeshift;
    var root = j(file.source);

    const metricsImport = j.importDeclaration(
        [j.importSpecifier(
            j.identifier("exposeMetrics")
        )],
        j.literal("react-metrics")
    );

    const updateTrackingMethod = (node) => {
        const method = j(node);
        let returnValue;

        method
            .find(j.VariableDeclarator, {
                init: {
                    callee: {
                        name: "getPageName"
                    }
                }
            }).forEach(p => {
                returnValue = p.value.id;
            });

        method
            .find(j.ReturnStatement)
            .forEach(p => {
                p.value.argument = returnValue;
            });
    };

    const addDecorator = () => {
        root
            .find(j.ClassDeclaration)
            .forEach(function (p) {
                if (!p.node.decorators) {
                    p.node.decorators = [];
                }

                p.node.decorators.push(
                    j.decorator(
                        j.identifier("exposeMetrics")
                    )
                );
            });
    };

    root
        .find(j.ImportDeclaration, {
            type: "ImportDeclaration",
            specifiers: [{
                local: {
                    name: "getPageName"
                }
            }],
            source: {
                type: "Literal",
                value: "analytics.config"
            }
        })
        .forEach(function (p) {
            p.value.source = j.literal("src/metrics.config.js");
            j(p).insertBefore(metricsImport);
            addDecorator();
        });

    root
        .find(j.MethodDefinition, {
            type: "MethodDefinition",
            key: {
                name: "willTrackPageView"
            }
        })
        .forEach(function (p) {
            updateTrackingMethod(p);
        });

    return toSource(root, j);
};
