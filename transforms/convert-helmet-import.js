const options = require("./util/options");
const updateImport = require("./util/update-import");

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

    return root.toSource(options);
};
