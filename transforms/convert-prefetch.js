import updateImport from "./util/update-import";

module.exports = function (file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);

    updateImport(
        j,
        root,
        {
            importName: "Prefetch",
            importSource: "@nfl/gridiron/addons",
            newName: "Prefetch",
            newSource: "react-wildcat-prefetch"
        }
    );

    return root.toSource(options);
};
