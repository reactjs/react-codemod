import * as assert from "assert";
import { readFile } from "fs/promises";
import { join } from "path";
import * as jscodeshift from "jscodeshift";
import { type API } from "jscodeshift";
import transform from "../react-19-replace-default-props.codemod";

const buildApi = (parser: string | undefined): API => ({
  j: parser ? jscodeshift.withParser(parser) : jscodeshift,
  jscodeshift: parser ? jscodeshift.withParser(parser) : jscodeshift,
  stats: () => {
    console.error(
      "The stats function was called, which is not supported on purpose"
    );
  },
  report: () => {
    console.error(
      "The report function was called, which is not supported on purpose"
    );
  },
});

describe("react/19/replace-default-props", () => {
  it("should correctly transform single default prop", async () => {
    const INPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/single-default-prop.input.tsx"
      ),
      "utf-8"
    );
    const OUTPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/single-default-prop.output.tsx"
      ),
      "utf-8"
    );

    const actualOutput = transform(
      {
        path: "index.js",
        source: INPUT,
      },
      buildApi("tsx")
    );

    assert.deepEqual(
      actualOutput?.replace(/W/gm, ""),
      OUTPUT.replace(/W/gm, "")
    );
  });

  it("should correctly transform multiple default props", async () => {
    const INPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/multiple-default-props.input.tsx"
      ),
      "utf-8"
    );
    const OUTPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/multiple-default-props.output.tsx"
      ),
      "utf-8"
    );

    const actualOutput = transform(
      {
        path: "index.js",
        source: INPUT,
      },
      buildApi("tsx")
    );

    assert.deepEqual(
      actualOutput?.replace(/W/gm, ""),
      OUTPUT.replace(/W/gm, "")
    );
  });

  it("should correctly transform nested default props", async () => {
    const INPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/nested-destructuring.input.tsx"
      ),
      "utf-8"
    );
    const OUTPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/nested-destructuring.output.tsx"
      ),
      "utf-8"
    );

    const actualOutput = transform(
      {
        path: "index.js",
        source: INPUT,
      },
      buildApi("tsx")
    );

    assert.deepEqual(
      actualOutput?.replace(/W/gm, ""),
      OUTPUT.replace(/W/gm, "")
    );
  });

  it("should correctly transform default props with functions", async () => {
    const INPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/with-functions.input.tsx"
      ),
      "utf-8"
    );
    const OUTPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/with-functions.output.tsx"
      ),
      "utf-8"
    );

    const actualOutput = transform(
      {
        path: "index.js",
        source: INPUT,
      },
      buildApi("tsx")
    );

    assert.deepEqual(
      actualOutput?.replace(/W/gm, ""),
      OUTPUT.replace(/W/gm, "")
    );
  });

  it("should correctly transform when props have rest prop", async () => {
    const INPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/with-rest-props.input.tsx"
      ),
      "utf-8"
    );
    const OUTPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/with-rest-props.output.tsx"
      ),
      "utf-8"
    );

    const actualOutput = transform(
      {
        path: "index.js",
        source: INPUT,
      },
      buildApi("tsx")
    );

    assert.deepEqual(
      actualOutput?.replace(/W/gm, ""),
      OUTPUT.replace(/W/gm, "")
    );
  });

  it("should correctly transform when props are not destructured", async () => {
    const INPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/props-not-destructured.input.tsx"
      ),
      "utf-8"
    );
    const OUTPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/props-not-destructured.output.tsx"
      ),
      "utf-8"
    );

    const actualOutput = transform(
      {
        path: "index.js",
        source: INPUT,
      },
      buildApi("tsx")
    );

    assert.deepEqual(
      actualOutput?.replace(/W/gm, ""),
      OUTPUT.replace(/W/gm, "")
    );
  });

  it("should correctly transform when some but not all props are defaulted", async () => {
    const INPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/partial-default-props.input.tsx"
      ),
      "utf-8"
    );
    const OUTPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/partial-default-props.output.tsx"
      ),
      "utf-8"
    );

    const actualOutput = transform(
      {
        path: "index.js",
        source: INPUT,
      },
      buildApi("tsx")
    );

    assert.deepEqual(
      actualOutput?.replace(/W/gm, ""),
      OUTPUT.replace(/W/gm, "")
    );
  });

  it("should correctly transform when props are not destructured", async () => {
    const INPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/button-jsx-example-input.jsx"
      ),
      "utf-8"
    );
    const OUTPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/button-jsx-example-output.jsx"
      ),
      "utf-8"
    );

    const actualOutput = transform(
      {
        path: "index.js",
        source: INPUT,
      },
      buildApi("jsx")
    );

    const fs = require("fs");
    fs.writeFileSync(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/button-jsx-example-output.jsx"
      ),
      actualOutput
    );

    assert.deepEqual(
      actualOutput?.replace(/W/gm, ""),
      OUTPUT.replace(/W/gm, "")
    );
  });

  it("rest element example", async () => {
    const INPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/rest-element-example.input.jsx"
      ),
      "utf-8"
    );
    const OUTPUT = await readFile(
      join(
        __dirname,
        "..",
        "__testfixtures__/react-19-replace-default-props/rest-element-example.output.jsx"
      ),
      "utf-8"
    );

    const actualOutput = transform(
      {
        path: "index.js",
        source: INPUT,
      },
      buildApi("jsx")
    );

    assert.deepEqual(
      actualOutput?.replace(/W/gm, ""),
      OUTPUT.replace(/W/gm, "")
    );
  });
});
