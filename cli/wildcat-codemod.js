#! /usr/bin/env node

var path = require("path");

require("babel-core/register")({
    "presets": [
        path.resolve(__dirname, "../node_modules/babel-preset-es2015"),
        path.resolve(__dirname, "../node_modules/babel-preset-stage-0")
    ]
});

require("../src/codemod.js");
