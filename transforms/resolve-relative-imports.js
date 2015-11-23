const fs = require("fs");
const cwd = process.cwd();
const path = require("path");
const resolve = require("resolve");
const toSource = require("./util/to-source");

module.exports = function (file, api) {
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

    const markForDeletion = function (filePath) {
        fs.appendFile(__dirname + "/../empty_indexes.txt", "\n" + filePath, function (err) {
            if (err) {
                console.error("Error:", err);
            }
        });
    };

    const resolveImportSource = function (importSource, importOptions) {
        var absoluteImportPath;
        var relativeImportPath;

        var newImportSource = importSource;

        try {
            // First, find the canonical path to the import
            // This can be ./path/index.js or ./path.js
            // We don't care, just let Node figure it out
            absoluteImportPath = resolve.sync(importSource, importOptions);

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
            if (importStatements.paths().length === 2) {
                const paths = importStatements.paths();
                const firstStatement = paths[0];
                const lastStatement = paths[1];

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
                        absoluteImportPath = resolve.sync(firstStatement.node.source.value, Object.assign({}, importOptions, {
                            // Trick the resolver to resolve from the current index file
                            basedir: path.dirname(absoluteImportPath),
                            moduleDirectory: path.dirname(absoluteImportPath)
                        }));
                    }
                }
            }

            // Finally, make the import relative to the current file...
            relativeImportPath = path.relative(
                importOptions.relativeImportDirectory || importOptions.basedir,
                absoluteImportPath
            );

            // ...and prepend a dot/slash so jspm is happy
            if (!importOptions.relativeImportDirectory && !relativeImportPath.startsWith(".")) {
                // (...only if we need to)
                relativeImportPath = "./" + relativeImportPath;
            }

            newImportSource = relativeImportPath;
        } catch (e) {} // eslint-disable-line no-empty

        return newImportSource;
    };

    // Feed the original code to our interpreter
    const root = j(file.source)
        // Find all imports in the file
        .find(j.ImportDeclaration)
        // And remap them if necessary
        .map(function (p) {
            const importSource = p.node.source.value;
            var newImportSource;

            if (importSource.startsWith("src") && !file.path.includes("test/e2e")) {
                const rootRelativeOptions = Object.assign({}, resolveOptions, {
                    basedir: cwd,
                    moduleDirectory: cwd,
                    relativeImportDirectory: path.join(cwd, "src")
                });

                newImportSource = resolveImportSource(importSource, rootRelativeOptions);

                newImportSource = newImportSource
                    .replace(/^domains\/([a-zA-Z]+)/, function (match, p1) {
                        return match.replace(p1, p1.toLowerCase()) + "/www";
                    });
            } else {
                newImportSource = resolveImportSource(importSource, resolveOptions);
            }

            if (newImportSource) {
                p.node.source.value = newImportSource;
            }

            // Return the mapped value
            return p;
        });

    return toSource(root, j);
};
