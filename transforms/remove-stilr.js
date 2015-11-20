const toSource = require("./util/to-source");

module.exports = function (file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);

    var filterImport = function (remove, imports) {
        return imports.filter(function (imp) {
            return imp.imported.name !== remove;
        });
    };

    root.find(j.ImportDeclaration, {
        source: {
            type: "Literal",
            value: "@nfl/gridiron/addons"
        },
        specifiers: [{
            imported: {
                name: "StyleSheet"
            }
        }]
    }).forEach(function (p) {
        p.value.specifiers = filterImport("StyleSheet", p.value.specifiers);
        if (!p.value.specifiers.length) {
            j(p).replaceWith("");
        }
    });

    root.find(j.CallExpression, {
        type: "CallExpression",
        callee: {
            object: {
                name: "StyleSheet"
            },
            property: {
                name: "create"
            }
        }
    }).forEach(function (p) {
        var styles = p.value.arguments[0];
        j(p).replaceWith(styles);
    });

    return toSource(root, j);
};
