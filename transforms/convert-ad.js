import updateImport from "./update-import";

module.exports = function (file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);

    updateImport(
        j,
        root,
        {
            importName: "Ad",
            importSource: "@nfl/gridiron/addons",
            newName: "Ad",
            newSource: "react-gpt"
        }
    );

    return root.toSource(options);
};
