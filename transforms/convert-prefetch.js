const options = require("./util/options");
const updateImport = require("./util/update-import");

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

    return root.toSource(options);
};
