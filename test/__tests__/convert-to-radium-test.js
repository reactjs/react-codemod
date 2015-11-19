"use strict";

import p from "path";
import sinon from "sinon";

var errorArgs1 = [
    "%s: Could not update styles on line %s",
    "/Users/daniel.howard/Projects/react-codemod/test/convert-to-radium-test.js",
    39
];

var errorArgs2 = [
    "%s: Could not import styles, you will need to add key attributes manually to any elements with interactive styles",
    "/Users/daniel.howard/Projects/react-codemod/test/convert-to-radium-test.js"
];

describe("convert-to-radium", () => {
    var logSpy = sinon.spy(console, "error");

    it("transforms correctly", () => {
        const path = p.resolve(__dirname, "../convert-to-radium-test.js");

        test("convert-to-radium", "convert-to-radium-test", null, {path});
        expect(console.error.calledWith(errorArgs1[0], errorArgs1[1], errorArgs1[2])).toEqual(true);

        test("convert-to-radium", "missing-styles", null, {path});
        expect(console.error.calledWith(errorArgs2[0], errorArgs2[1])).toEqual(true);
    });
});
