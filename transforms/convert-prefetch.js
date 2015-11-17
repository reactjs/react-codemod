import updateImport from "./update-import";

module.exports = function (file, api) {
    var j = api.jscodeshift;
    var root = j(file.source);

    updateImport(
        j,
        root,
        {
            importName: "Prefetch",
            importSource: "@nfl/gridiron",
            newName: "Prefetch",
            newSource: "react-wildcat-prefetch"
        }
    );

    return root.toSource();
};
