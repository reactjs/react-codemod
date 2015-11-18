#! /usr/bin/env babel-node

import {echo, exit, cat, rm, find, mv} from "shelljs";
import nomnom from "nomnom";
import fs from "fs";
import path from "path";
import {exec} from "child_process";
import _ from "underscore";


const transformBasePath = path.join(__dirname, "..", "transforms");
const runFirst = [
    "resolve-relative-imports.js"
];
const runLast = [
    "remove-stilr.js",
    "convert-to-radium.js"
];

const {src, all, single, clean} = nomnom.options({
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


if (!src) {
    echo("src option is required");
    exit(1);
}

const buildCMD = (filePath, file) => {
    return `jscodeshift -t ${filePath} ${file} --extensions "jsx,js"`;
};

const renameFiles = () => {
    echo("Renaming files from .jsx to .js");

    find(src)
        .filter(file => {
            return file.match(/\.jsx$/);
        }).map(file => {
            mv(file, file.replace("jsx", "js"));
        });
};

const markForDeletion = () => {
    const emptyIndexFile = path.join(__dirname, "..", "empty_indexes.txt");
    const files = cat(emptyIndexFile)
                    .split("\n")
                    .filter(f => f !== "");
    const uniqueFiles = _.uniq(files);
    const filesList = uniqueFiles.join("\n");
    filesList.to(emptyIndexFile);

    echo("The following index files have been marked for deletion.");
    echo("run `wildcat-codemod -C` to delete them:\n");
    echo(filesList);
};

const applyTransform = (transforms) => {
    if (!transforms.length) {
        markForDeletion();
        return;
    }

    const transform = transforms.shift();
    const transformFilePath = path.join(transformBasePath, transform);
    const cmd = buildCMD(transformFilePath, src);

    echo("Applying transform", transform);

    exec(cmd, (err, stout) => {
        echo(stout);
        applyTransform(transforms);
    });
};

const deleteEmptyIndexes = () => {
    echo("Removing unused index files");
    const emptyIndexFile = path.join(__dirname, "..", "empty_indexes.txt");
    const emptyIndexFiles = cat(emptyIndexFile);

    if (emptyIndexFiles === null) {
        return;
    }

    emptyIndexFiles
        .split("\n")
        .filter(f => f !== "")
        .map(f => rm(f));
    rm(emptyIndexFile);
};

if (clean) {
    deleteEmptyIndexes();
} else if (all) {
    const transforms = fs.readdirSync(transformBasePath)
                        .filter(fileName => fileName.match(".js$"))
                        .filter(filename => runFirst.indexOf(filename) === -1)
                        .filter(filename => runLast.indexOf(filename) === -1);
    const orderedTransforms = [...runFirst, ...transforms, ...runLast];

    renameFiles();
    applyTransform(orderedTransforms);
}

if (single) {
    const transformFilePath = path.join(transformBasePath, single);
    const cmd = buildCMD(transformFilePath, src);
    exec(cmd, (err, stout) => {
        echo(err);
        echo(stout);
    });
}
