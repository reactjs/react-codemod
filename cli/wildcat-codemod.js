#! /usr/bin/env babel-node

import {echo, exit, find, mv} from "shelljs";
import nomnom from "nomnom";
import fs from "fs";
import path from "path";
import {exec} from "child_process";


const transformBasePath = path.join(__dirname, "..", "transforms");
const runFirst = [
    "resolve-relative-imports.js"
];
const runLast = [
    "remove-stilr.js",
    "convert-to-radium.js"
];

const {src, all, single} = nomnom.options({
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
    }
}).parse();


if (!src) {
    echo("src option is required");
    exit(1);
}

const buildCMD = (filePath, file) => {
    return `jscodeshift -t ${filePath} ${file} --extensions "jsx,js"`;
};

const renameFiles = (cb) => {
    echo("Renaming files from .jsx to .js");

    find(src)
        .filter(file => {
            return file.match(/\.jsx$/);
        }).map(file => {
            mv(file, file.replace("jsx", "js"));
        });
}

const applyTransform = (transforms) => {
    if (!transforms.length) {
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

if (all) {
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
