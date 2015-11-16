module.exports = function (file, api) {
    var j = api.jscodeshift;
    var root = j(file.source);

    const ImportDeclaration = (value) => ({
        type: "ImportDeclaration",
        source: {
            type: "Literal",
            value
        }
    });

    const importStatement = (defaultImport, source) => j.importDeclaration(
        [j.importDefaultSpecifier(
            j.identifier(defaultImport)
        )],
        j.literal(source)
    );

    const superClass = (name) => ({
        superClass: {
            name
        }
    });

    const removeGridironImport = (p) => {
        j(p).remove();
        return p;
    };

    root.find(j.ImportDeclaration, ImportDeclaration("@nfl/gridiron"))
        .forEach(removeGridironImport);


    //change superclass to React.Component
    root.find(j.ClassDeclaration, superClass("GridironComponent"))
        .forEach(p => p.node.superClass.name = "React.Component");

    //import react if there isn't one
    root.find(j.ClassDeclaration, superClass("React.Component"))
        .forEach(() => {
            const reactImport = root.find(j.ImportDeclaration, ImportDeclaration("react"));
            if (reactImport.paths().length === 0) {
                root.find(j.ClassDeclaration)
                    .insertBefore(importStatement("React", "react"));
            }
        });


    return root.toSource({esprima: require("babel-core")});
};
