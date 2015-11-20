"use strict";

import p from "path";
import sinon from "sinon";

var errorArgs1 = ["%s: Could not update styles on line %s", null, 39];
var errorArgs2 = ["%s: Could not import styles, you will need to add key attributes manually to any elements with interactive styles"];

describe("convert-to-radium", () => {
    var logSpy = sinon.spy(console, "error");

    it("transforms correctly", () => {
        const path = p.resolve(__dirname, "../convert-to-radium-test.js");

        test("convert-to-radium", "convert-to-radium-test", null, {path});
        expect(console.error.calledWith(errorArgs1[0], sinon.match.any, errorArgs1[2])).toEqual(true);

        test("convert-to-radium", "missing-styles", null, {path});
        expect(console.error.calledWith(errorArgs2[0])).toEqual(true);
    });
});
