const options = require("./util/options");
const updateImport = require("./util/update-import");

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
            newSource: "addons/Ad"
        }
    );

    return root.toSource(options);
};
