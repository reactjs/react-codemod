var fs = require("fs");
var path = require("path");
var resolve = require("resolve");

module.exports = function (file, api, options) {
    const j = api.jscodeshift;

    // We use resolve to find the absolute paths of our imports
    // Using the current file name as the base path
    const resolveOptions = {
        paths: [],
        basedir: path.dirname(file.path),
        extensions: [
            ".js",
            ".jsx"
        ],
        moduleDirectory: path.dirname(file.path)
    };

    const markForDeletion = (filePath) => {
        fs.appendFile(`${__dirname}/../empty_indexes.txt`, `\n${filePath}`, function (err) {
            if (err) {
                console.error("Error:", err);
            }
        });
    };

    // Feed the original code to our interpreter
    return j(file.source)
        // Find all imports in the file
        .find(j.ImportDeclaration)
        // And remap them if necessary
        .map(p => {
            try {
                // First, find the canonical path to the import
                // This can be ./path/index.js or ./path.js
                // We don't care, just let Node figure it out
                let absoluteImportPath = resolve.sync(p.node.source.value, resolveOptions);

                // We assume the file is a relative file
                // (Otherwise it will throw an error and bail)
                // Load the contents of the file as a string...
                const importFileSource = fs.readFileSync(absoluteImportPath, "utf8");

                // ...and feed it to the AST interpreter...
                const importStatements = j(importFileSource)
                    // ...and find all the statements inside
                    .find(j.Statement);

                // If only 2 statements exist in this file,
                // let's check that one is an import and one is a default export
                if (importStatements.__paths.length === 2) {
                    const [firstStatement, lastStatement] = importStatements.__paths;

                    // If the first statement is an ImportDeclaration
                    // and the last statement is an ExportDefaultDeclaration
                    if (
                        firstStatement.node.type === "ImportDeclaration" &&
                        lastStatement.node.type === "ExportDefaultDeclaration"
                    ) {
                        const importName = firstStatement.node.specifiers[0].local.name;
                        const exportName = lastStatement.node.declaration.name;

                        // If the module this file is exporting is the module it is importing...
                        if (exportName === importName) {
                            // Mark the index file for deletion
                            markForDeletion(absoluteImportPath);

                            // Then bypass the shell index file entirely
                            // Set the import path to be the import defined in the shell index file
                            absoluteImportPath = resolve.sync(firstStatement.node.source.value, {
                                ...resolveOptions,

                                // Trick the resolver to resolve from the current index file
                                basedir: path.dirname(absoluteImportPath),
                                moduleDirectory: path.dirname(absoluteImportPath)
                            });
                        }
                    }
                }

                // Finally, make the import relative to the current file...
                let relativeImportPath = path.relative(resolveOptions.basedir, absoluteImportPath);

                // ...and prepend a dot/slash so jspm is happy
                if (!relativeImportPath.startsWith(".")) {
                    // (...only if we need to)
                    relativeImportPath = `./${relativeImportPath}`;
                }

                p.node.source.value = relativeImportPath;
            } catch (e) {} // eslint-disable-line no-empty

            // Return the mapped value
            return p;
        })

        // Convert AST to source
        .toSource(options);
};
