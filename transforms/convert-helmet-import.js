import updateImport from "./util/update-import";

module.exports = function (file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);

    updateImport(
        j,
        root,
        {
            importName: "Helmet",
            importSource: "@nfl/gridiron/addons",
            newName: "Helmet",
            newSource: "react-helmet"
        }
    );

    return root.toSource(options);
};
