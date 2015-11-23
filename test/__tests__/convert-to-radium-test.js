"use strict";

import p from "path";
import sinon from "sinon";

var errorArg1 = "Could not update styles on line";
var errorArg2 = "Could not import styles, you will need to add key attributes manually to any elements with interactive styles";

describe("convert-to-radium", () => {
    var logSpy = sinon.spy(console, "error");

    it("transforms correctly", () => {
        const path = p.resolve(__dirname, "../convert-to-radium-test.js");

        test("convert-to-radium", "convert-to-radium-test", null, {path});
        expect(console.error.calledWithMatch(errorArg1)).toEqual(true);

        test("convert-to-radium", "missing-styles", null, {path});
        expect(console.error.calledWithMatch(errorArg2)).toEqual(true);
    });
});
