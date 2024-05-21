/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

"use strict";

const flowTests = [
  "literal-with-owner",
  "literal-without-owner",
  "value-with-owner",
];

const typescriptTests = ["literal-with-owner"];

const defineTest = require("jscodeshift/dist/testUtils").defineTest;

describe("string-refs", () => {
  describe("flow", () => {
    flowTests.forEach((test) =>
      defineTest(__dirname, "string-refs", null, `string-refs/${test}`, {
        parser: "flow",
      })
    );
  });

  describe("typescript", () => {
    typescriptTests.forEach((test) =>
      defineTest(
        __dirname,
        "string-refs",
        null,
        `string-refs/typescript/${test}`,
        { parser: "tsx" }
      )
    );
  });
});
