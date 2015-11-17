"use strict";

import p from "path";

describe("convert-to-radium", () => {
    it("transforms correctly", () => {
        const path = p.resolve(__dirname, "../convert-to-radium-test.js");
        test("convert-to-radium", "convert-to-radium-test", null, {path});
    });
});
