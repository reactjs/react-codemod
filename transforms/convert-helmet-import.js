module.exports = function (file, api, options) {
    const j = api.jscodeshift;

    return j(file.source)
        .find(j.ImportDeclaration)
        .filter(p => p.node.specifiers.length === 1)
        .filter(p => p.node.source.value === "@nfl/gridiron/addons")
        .filter(p => {
            const name = p.node.specifiers[0].local.name;
            return name === "Helmet";
        })
        .forEach(p => {
            j(p).replaceWith(j.importDeclaration(
                [
                    j.importDefaultSpecifier(j.identifier("Helmet"))
                ],
                j.literal("react-helmet")
            ));
        })
        .toSource(options);
};
