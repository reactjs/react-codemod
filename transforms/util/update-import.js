const update = function (j, root, opts) {
    // importName, importSource, newName, newSource
    const newImport = j.importDeclaration(
        [j.importDefaultSpecifier(
            j.identifier(opts.newName)
        )],
        j.literal(opts.newSource)
    );

    root
        .find(j.ImportDeclaration, {
            type: "ImportDeclaration",
            specifiers: [{
                local: {
                    name: opts.importName
                }
            }],
            source: {
                type: "Literal",
                value: opts.importSource
            }
        })
        .forEach(function (p) {
            const specifiers = p.value.specifiers.filter(function (s) {
                return s.imported.name !== opts.importName;
            });

            p.value.specifiers = specifiers;

            j(p).insertAfter(newImport);

            if (!specifiers.length) {
                j(p).remove();
            }
        });

    return root;
};

module.exports = update;
