"use strict";

const tsTests = ["use-context", "use-context-2", "any-use-context"];

const jsTests = [
  "use-context",
  "use-context-2",
  "any-use-context",
  "mixed-import",
];

const defineTest = require("jscodeshift/dist/testUtils").defineTest;

describe("use-context-hook", () => {
  jsTests.forEach((test) =>
    defineTest(__dirname, "use-context-hook", null, `use-context-hook/${test}`)
  );

  describe("typescript", () => {
    beforeEach(() => {
      jest.mock("../use-context-hook", () => {
        return Object.assign(jest.requireActual("../use-context-hook"), {
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
        "use-context-hook",
        null,
        `use-context-hook/typescript/${test}`
      );
    });
  });
});
