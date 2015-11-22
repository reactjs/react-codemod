const updateImport = function (j, root, opts) {
    var forceDecorators = false;

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
            source: {
                type: "Literal",
                value: opts.importSource
            }
        })
        .filter(function (p) {
            return p.value.specifiers.filter(function (s) {
                return s.imported.name === opts.importName;
            }).length;
        })
        .forEach(function (p) {
            const specifiers = p.value.specifiers.filter(function (s) {
                return s.imported.name !== opts.importName;
            });

            p.value.specifiers = specifiers;

            p.insertAfter(newImport);

            if (!specifiers.length) {
                p.prune();
            }

            forceDecorators = true;
        });

    return forceDecorators;
};

module.exports = updateImport;
