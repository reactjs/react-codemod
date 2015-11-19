/* global cat, echo, exec, exit, mv, rm */
require("shelljs/global");

const nomnom = require("nomnom");
const fs = require("fs");
const path = require("path");
const _ = require("underscore");

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
    const emptyIndexFile = path.join(__dirname, "..", "empty_indexes.txt");
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
    echo("Renaming files from .jsx to .js");

    find(opts.src)
        .filter(function (file) {
            return file.match(/\.jsx$/);
        }).map(function (file) {
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

    const cmd = buildCMD(transformFilePath, opts.src.replace(".jsx", ".js"));

    echo("Applying transform", transformName);

    exec(cmd, function (err) {
        if (err) {
            console.error(err);
        }

        applyTransform(transforms);
    });
};

const deleteEmptyIndexes = function () {
    echo("Removing unused index files");
    const emptyIndexFile = path.join(__dirname, "..", "empty_indexes.txt");
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
} else if (opts.all) {
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

    renameFiles();
    applyTransform(orderedTransforms);
}

if (opts.single) {
    applyTransform([
        opts.single
    ]);
}
