const updateImport = require("./util/update-import");
const toSource = require("./util/to-source");

module.exports = function (file, api) {
    var forceDecorators = false;

    const j = api.jscodeshift;
    const root = j(file.source);

    forceDecorators = updateImport(
        j,
        root,
        {
            importName: "Prefetch",
            importSource: "@nfl/gridiron/addons",
            newName: "Prefetch",
            newSource: "react-wildcat-prefetch"
        }
    );

    root
        .find(j.ExportDefaultDeclaration, {
            declaration: {
                type: "CallExpression",
                callee: {
                    type: "Identifier",
                    name: "Prefetch"
                }
            }
        })
        .forEach(function (p) {
            const args = p.get("declaration").get("arguments");

            const componentId = args.get(0);

            p.replace(
                j.exportDefaultDeclaration(
                    j.callExpression(
                        j.callExpression(
                            j.identifier(p.get("declaration").get("callee").get("name").value),
                            args.value.slice(1)
                        ),
                        [componentId.value]
                    )
                )
            );

            p.insertAfter(";");
        });

    return toSource(root, j, forceDecorators);
};

