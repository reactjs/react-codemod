const updateImport = require("./util/update-import");
const toSource = require("./util/to-source");

module.exports = function (file, api) {
    var j = api.jscodeshift;
    var root = j(file.source);

    updateImport(
        j,
        root,
        {
            importName: "Ad",
            importSource: "@nfl/gridiron/addons",
            newName: "Ad",
            newSource: "addons/Ad/Ad.js"
        }
    );

    return toSource(root, j);
};
