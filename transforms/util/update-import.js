const updateImport = function (j, root, opts) {
    var forceDecorators = false;

    // importName, importSource, newName, newSource
    var newImport;

    if (opts.newName) {
        newImport = j.importDeclaration(
            [j.importDefaultSpecifier(
                j.identifier(opts.newName)
            )],
            j.literal(opts.newSource)
        );
    }

    root
        .find(j.ImportDeclaration, {
            type: "ImportDeclaration",
            source: {
                type: "Literal",
                value: opts.importSource
            }
        })
        .filter(function (p) {
            if (opts.importName) {
                return p.value.specifiers.filter(function (s) {
                    return s.imported.name === opts.importName;
                }).length;
            }

            return p;
        })
        .forEach(function (p) {
            if (newImport) {
                const specifiers = p.value.specifiers.filter(function (s) {
                    return s.imported.name !== opts.importName;
                });

                p.value.specifiers = specifiers;

                p.insertAfter(newImport);

                if (!specifiers.length) {
                    p.prune();
                }

                forceDecorators = true;
            } else if (opts.newSource) {
                p.value.source.value = opts.newSource;
            }
        });

    return forceDecorators;
};

module.exports = updateImport;
