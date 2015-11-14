const update = function (j, root, {importName, importSource, newName, newSource}) {
    const newImport = j.importDeclaration(
        [j.importDefaultSpecifier(
            j.identifier(newName)
        )],
        j.literal(newSource)
    );

    root
        .find(j.ImportDeclaration, {
            type: "ImportDeclaration",
            specifiers: [{
                local: {
                    name: importName
                }
            }],
            source: {
                type: "Literal",
                value: importSource
            }
        })
        .forEach(p => {
            let {specifiers} = p.value;
            specifiers = specifiers.filter(s => {
                return s.imported.name !== importName;
            });
            p.value.specifiers = specifiers;

            j(p).insertAfter(newImport);

            if (!specifiers.length) {
                j(p).remove();
            }
        });

    return root;
};

export default update;
