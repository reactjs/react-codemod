"use strict";

const tests = ["with-provider", "with-provider-2", "no-provider"];

const defineTest = require("jscodeshift/dist/testUtils").defineTest;

describe("remove-context-provider", () => {
  tests.forEach((test) =>
    defineTest(
      __dirname,
      "remove-context-provider",
      null,
      `remove-context-provider/${test}`
    )
  );

  describe("typescript", () => {
    beforeEach(() => {
      jest.mock("../remove-context-provider", () => {
        return Object.assign(jest.requireActual("../remove-context-provider"), {
          parser: "tsx",
        });
      });
    });

    afterEach(() => {
      jest.resetModules();
    });

    tests.forEach((test) => {
      defineTest(
        __dirname,
        "remove-context-provider",
        null,
        `remove-context-provider/typescript/${test}`
      );
    });
  });
});
