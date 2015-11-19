const updateImport = require("./util/update-import");
const toSource = require("./util/to-source");

module.exports = function (file, api) {
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

    return toSource(root, j);
};
