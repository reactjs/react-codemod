/* global cat, echo, exec, exit, mv, rm */
require("shelljs/global");

const nomnom = require("nomnom");
const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const chalk = require("chalk");

const pkg = require(path.join(__dirname, "..", "package.json"));
const emptyIndexFile = path.join(__dirname, "..", "empty_indexes.txt");
const transformBasePath = path.join(__dirname, "..", "transforms");
const runFirst = [];
const runLast = [
    "remove-stilr.js",
    "convert-to-radium.js",
    "resolve-relative-imports.js"
];

const getTransforms = function () {
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

    return orderedTransforms;
};

const opts = nomnom
    .options({
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
            help: "Run individual transforms. Use `wildcat-codemod --transforms` for a list of avaliable transforms.",
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
    })
    .option("transforms", {
        abbr: "t",
        flag: true,
        help: "Print a list of available transforms",
        callback: function () {
            const orderedTransforms = getTransforms();

            console.log();
            console.log(chalk.bold("Usage:"), "wildcat-codemod [src] --single", chalk.blue("[transform]"));
            console.log();
            console.log(chalk.blue("Transforms:"));
            console.log(orderedTransforms.map(function (t) {
                return "   " + t.replace(".js", "");
            }).join("\n"));
        }
    })
    .option("version", {
        abbr: "v",
        flag: true,
        help: "Print version and exit",
        callback: function () {
            return pkg.version;
        }
    }).parse();

if (opts.transforms) {
    exit(0);
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

    const uniqueFiles = _.uniq(files).map(function (f) {
        return path.relative(process.cwd(), f);
    });

    if (uniqueFiles.length) {
        const filesList = uniqueFiles.join("\n");
        filesList.to(emptyIndexFile);

        echo();
        echo(chalk.gray(filesList));
        echo();
        echo(chalk.cyan("The above index files have been marked for deletion."));
        echo(chalk.cyan("These are considered shell files with no useful functionality."));
        echo(chalk.cyan("Their references have been removed from the codebase and can be safely deleted."));
        echo(chalk.yellow("run `wildcat-codemod -C` to delete them"));
    }

    echo();
    echo("---------------------------------------------");
    echo(chalk.bold("Next steps:"));
    echo();
    echo("1. If you haven't yet, clone a copy of the web project to serve as your web-wildcat repository:");
    echo(chalk.cyan("git clone --branch wildcat git@github.dm.nfl.com:NFL/web.git web-wildcat"));
    echo();
    echo("2. Drop your project folder into " + chalk.cyan("web-wildcat/src/domains/*/*/sites/[your-project]"));
    echo("3. Run " + chalk.cyan("`npm run lint`") + ". This should surface missing/invalid import paths.");
    echo("4. Run " + chalk.cyan("`npm run dev`") + ", load https://www.nfl.dev:3000/[your-project], and cross your fingers!");
    echo();
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
        return setTimeout(markForDeletion, 1000);
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

if (!opts.src && !opts.clean) {
    echo("src option is required");
    exit(1);
}

if (opts.clean) {
    deleteEmptyIndexes();
    exit(0);
} else {
    fs.writeFileSync(emptyIndexFile, "");
}

if (!opts.norename) {
    renameFiles();
}

if (opts.all) {
    applyTransform(getTransforms());
} else if (opts.single) {
    applyTransform([
        opts.single
    ]);
}
