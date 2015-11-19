const updateImport = require("./util/update-import");
const toSource = require("./util/to-source");

module.exports = function (file, api) {
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

    return toSource(root, j);
};
