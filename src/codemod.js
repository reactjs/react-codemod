/* global cat, echo, exec, exit, mv, rm */
require("shelljs/global");

const nomnom = require("nomnom");
const fs = require("fs");
const path = require("path");
const _ = require("underscore");

const emptyIndexFile = path.join(__dirname, "..", "empty_indexes.txt");
const transformBasePath = path.join(__dirname, "..", "transforms");
const runFirst = [
    "resolve-relative-imports.js"
];
const runLast = [
    "remove-stilr.js",
    "convert-to-radium.js"
];

const opts = nomnom.options({
    src: {
        position: 0,
        help: "Source directory to run the transforms against"
    },
    all: {
        flag: true,
        abbr: "A",
        help: "Run all transforms in transforms folder"
    },
    single: {
        help: "Run single transform",
        abbr: "S"
    },
    clean: {
        flag: true,
        help: "Remove any files that have been marked for deletion",
        abbr: "C"
    },
    norename: {
        flag: true,
        help: "Don't rename .jsx files to .js",
        abbr: "N"
    }
}).parse();


if (!opts.src) {
    echo("src option is required");
    exit(1);
}

const buildCMD = function (filePath, file) {
    return "jscodeshift -t " + filePath + " " + file + " --extensions 'jsx,js'";
};

const markForDeletion = function () {
    if (!fs.existsSync(emptyIndexFile)) {
        fs.writeFileSync(emptyIndexFile, "");
    }

    const files = cat(emptyIndexFile)
                    .split("\n")
                    .filter(function (f) {
                        return f !== "";
                    });
    const uniqueFiles = _.uniq(files);
    const filesList = uniqueFiles.join("\n");
    filesList.to(emptyIndexFile);

    echo("The following index files have been marked for deletion.");
    echo("run `wildcat-codemod -C` to delete them:\n");
    echo(filesList);
};

const renameFiles = function () {
    var files = find(opts.src)
                    .filter(function (file) {
                        return file.match(/\.jsx$/);
                    });

    echo("\nRenaming " + files.length + " files from .jsx to .js");

    files.map(function (file) {
        mv(file, file.replace("jsx", "js"));
    });
};

const applyTransform = function (transforms) {
    if (!transforms.length) {
        markForDeletion();
        return;
    }

    const transformName = transforms.shift();
    const transformFilePath = require.resolve(path.join(transformBasePath, transformName));

    const renamedSrc = opts.norename ? opts.src : opts.src.replace(".jsx", ".js");
    const cmd = buildCMD(transformFilePath, renamedSrc);

    echo("\nApplying transform", transformName);

    exec(cmd, function (err) {
        if (err) {
            console.error(err);
        }

        applyTransform(transforms);
    });
};

const deleteEmptyIndexes = function () {
    echo("Removing unused index files");

    const emptyIndexFiles = cat(emptyIndexFile);

    if (emptyIndexFiles === null) {
        return;
    }

    emptyIndexFiles
        .split("\n")
        .filter(function (f) {
            return f !== "";
        })
        .map(function (f) {
            return rm(f);
        });
    rm(emptyIndexFile);
};

if (opts.clean) {
    deleteEmptyIndexes();
}

rm(emptyIndexFile);

if (!opts.norename) {
    renameFiles();
}

if (opts.all) {
    const transforms = fs.readdirSync(transformBasePath)
        .filter(function (filename) {
            return filename.match(".js$");
        })
        .filter(function (filename) {
            return runFirst.indexOf(filename) === -1;
        })
        .filter(function (filename) {
            return runLast.indexOf(filename) === -1;
        });

    const orderedTransforms = [].concat(runFirst, transforms, runLast);

    applyTransform(orderedTransforms);
} else if (opts.single) {
    applyTransform([
        opts.single
    ]);
}
