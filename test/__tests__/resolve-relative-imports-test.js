"use strict";

const path = require("path");

describe("resolve-relative-imports", () => {
    it("transforms correctly", () => {
        test("resolve-relative-imports", "resolve-directory-imports", null, {
            path: path.resolve(__dirname, "../resolve-directory-imports.js")
        });

        test("resolve-relative-imports", "resolve-shell-index-imports", null, {
            path: path.resolve(__dirname, "../resolve-shell-index-imports.js")
        });

        test("resolve-relative-imports", "resolve-unprefixed-imports", null, {
            path: path.resolve(__dirname, "../resolve-unprefixed-imports.js")
        });
    });
});
