const toSource = require("./util/to-source");

module.exports = function (file, api) {
    var j = api.jscodeshift;
    var root = j(file.source);

    const ImportDeclaration = function (value) {
        return {
            type: "ImportDeclaration",
            source: {
                type: "Literal",
                value: value
            }
        };
    };

    const importStatement = function (defaultImport, source) {
        return j.importDeclaration(
            [j.importDefaultSpecifier(
                j.identifier(defaultImport)
            )],
            j.literal(source)
        );
    };

    const superClass = function (name) {
        return {
            superClass: {
                name: name
            }
        };
    };

    const removeGridironImport = function (p) {
        j(p).remove();
        return p;
    };

    root.find(j.ImportDeclaration, ImportDeclaration("@nfl/gridiron"))
        .forEach(removeGridironImport);

    //change superclass to React.Component
    root.find(j.ClassDeclaration, superClass("GridironComponent"))
        .forEach(function (p) {
            p.node.superClass.name = "React.Component";
        });

    //import react if there isn't one
    root.find(j.ClassDeclaration, superClass("React.Component"))
        .forEach(function () {
            const reactImport = root.find(j.ImportDeclaration, ImportDeclaration("react"));
            if (reactImport.paths().length === 0) {
                root.find(j.ClassDeclaration)
                    .insertBefore(importStatement("React", "react"));
            }
        });

    return toSource(root, j);
};
