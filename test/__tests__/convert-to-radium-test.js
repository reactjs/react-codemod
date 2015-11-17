"use strict";

import p from "path";

describe("convert-to-radium", () => {
    it("transforms correctly", () => {
        const path = p.join(__dirname, "../");
        test("convert-to-radium", "convert-to-radium-test", null, {path});
    });
});
