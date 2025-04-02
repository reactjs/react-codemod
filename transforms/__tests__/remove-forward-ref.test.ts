"use strict";

const jsTests = [
  "function-expression",
  "arrow-function-expression",
  "forward-ref-import",
  "forward-ref-import-2",
  "props-identifier",
  "props-object-pattern",
  "callee-is-member-expression",
];

const tsTests = [
  "type-arguments",
  "type-arguments-custom-names",
  "type-arguments-type-literals",
  "props-type-literal",
];

const defineTest = require("jscodeshift/dist/testUtils").defineTest;

describe("remove-forward-ref", () => {
  jsTests.forEach((test) =>
    defineTest(
      __dirname,
      "remove-forward-ref",
      null,
      `remove-forward-ref/${test}`
    )
  );

  describe("typescript", () => {
    beforeEach(() => {
      jest.mock("../remove-forward-ref", () => {
        return Object.assign(jest.requireActual("../remove-forward-ref"), {
          parser: "tsx",
        });
      });
    });

    afterEach(() => {
      jest.resetModules();
    });

    tsTests.forEach((test) => {
      defineTest(
        __dirname,
        "remove-forward-ref",
        null,
        `remove-forward-ref/typescript/${test}`
      );
    });
  });
});
