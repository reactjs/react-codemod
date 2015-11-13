module.exports = function (file, api) {
    var j = api.jscodeshift;
    var root = j(file.source);

    const prefetchImport = j.importDeclaration(
        [j.importDefaultSpecifier(
            j.identifier("Prefetch")
        )],
        j.literal("react-wildcat-prefetch")
    );

    root
        .find(j.ImportDeclaration, {
            type: "ImportDeclaration",
            source: {
                type: "Literal",
                value: "@nfl/gridiron"
            }
        })
        .forEach(p => {
            let {specifiers} = p.value;
            specifiers = specifiers.filter(s => {
                return s.imported.name !== "Prefetch";
            });
            p.value.specifiers = specifiers;

            j(p).insertAfter(prefetchImport);

            if (!specifiers.length) {
                j(p).remove();
            }
        });

    return root.toSource();
};
