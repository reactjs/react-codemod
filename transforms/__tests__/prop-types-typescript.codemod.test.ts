/* @license
ISC License
Copyright (c) 2023, Mark Skelton
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

/*
Changes to the original file: changed tests structure
*/

import * as assert from "assert";
import transform from "../prop-types-typescript.codemod";
import * as jscodeshift from "jscodeshift";
import type { API } from "jscodeshift";

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

describe("ratchet", () => {
  it("arrow-function", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport const MyComponent = (props) => {\n  return <span />\n}\n\nMyComponent.propTypes = {\n  bar: PropTypes.string.isRequired,\n  foo: PropTypes.number,\n}\n';

    const OUTPUT =
      'import React from "react"\n\ninterface MyComponentProps {\n  bar: string\n  foo?: number\n}\n\nexport const MyComponent = (props: MyComponentProps) => {\n  return <span />\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("class-component-static", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport class MyComponent extends React.Component {\n  static propTypes = {\n    bar: PropTypes.string.isRequired,\n    foo: PropTypes.number,\n  }\n\n  render() {\n    return <span />\n  }\n}\n';

    const OUTPUT =
      'import React from "react"\n\ninterface MyComponentProps {\n  bar: string\n  foo?: number\n}\n\nexport class MyComponent extends React.Component<MyComponentProps> {\n  render() {\n    return <span />\n  }\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("class-component", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport class MyComponent extends React.Component {\n  render() {\n    return <span />\n  }\n}\n\nMyComponent.propTypes = {\n  bar: PropTypes.string.isRequired,\n  foo: PropTypes.number,\n}\n';

    const OUTPUT =
      'import React from "react"\n\ninterface MyComponentProps {\n  bar: string\n  foo?: number\n}\n\nexport class MyComponent extends React.Component<MyComponentProps> {\n  render() {\n    return <span />\n  }\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("comments", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport function MyComponent(props) {\n  return <span />\n}\n\nMyComponent.propTypes = {\n  /**\n   * A string with a\n   * wrapping comment.\n   * @example "foo"\n   */\n  bar: PropTypes.string.isRequired,\n  /**\n   * Some function\n   */\n  foo: PropTypes.func,\n}\n';

    const OUTPUT =
      'import React from "react"\n\ninterface MyComponentProps {\n  /**\n   * A string with a\n   * wrapping comment.\n   * @example "foo"\n   */\n  bar: string\n  /**\n   * Some function\n   */\n  foo?(...args: unknown[]): unknown\n}\n\nexport function MyComponent(props: MyComponentProps) {\n  return <span />\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("complex-props", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport function MyComponent(props) {\n  return <span />\n}\n\nMyComponent.propTypes = {\n  optionalArray: PropTypes.array,\n  optionalBool: PropTypes.bool,\n  optionalFunc: PropTypes.func,\n  optionalNumber: PropTypes.number,\n  optionalObject: PropTypes.object,\n  optionalString: PropTypes.string,\n  optionalSymbol: PropTypes.symbol,\n  optionalNode: PropTypes.node,\n  optionalElement: PropTypes.element,\n  optionalElementType: PropTypes.elementType,\n  optionalEnum: PropTypes.oneOf(["News", "Photos"]),\n  optionalNumericEnum: PropTypes.oneOf([1, 2, 3]),\n  optionalMixedEnum: PropTypes.oneOf([1, "Unknown", false, () => {}]),\n  optionalUnknownEnum: PropTypes.oneOf(Object.keys(arr)),\n  optionalUnion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),\n  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),\n  optionalObjectOf: PropTypes.objectOf(PropTypes.number),\n  optionalInstanceOf: PropTypes.instanceOf(Message),\n  optionalObjectWithShape: PropTypes.shape({\n    optionalProperty: PropTypes.string,\n    requiredProperty: PropTypes.number.isRequired,\n    functionProperty: PropTypes.func,\n  }),\n  optionalObjectWithStrictShape: PropTypes.exact({\n    optionalProperty: PropTypes.string,\n    requiredProperty: PropTypes.number.isRequired,\n  }),\n  requiredArray: PropTypes.array.isRequired,\n  requiredBool: PropTypes.bool.isRequired,\n  requiredFunc: PropTypes.func.isRequired,\n  requiredNumber: PropTypes.number.isRequired,\n  requiredObject: PropTypes.object.isRequired,\n  requiredString: PropTypes.string.isRequired,\n  requiredSymbol: PropTypes.symbol.isRequired,\n  requiredNode: PropTypes.node.isRequired,\n  requiredElement: PropTypes.element.isRequired,\n  requiredElementType: PropTypes.elementType.isRequired,\n  requiredEnum: PropTypes.oneOf(["News", "Photos"]).isRequired,\n  requiredUnion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,\n  requiredArrayOf: PropTypes.arrayOf(PropTypes.number).isRequired,\n  requiredObjectOf: PropTypes.objectOf(PropTypes.number).isRequired,\n  requiredInstanceOf: PropTypes.instanceOf(Message).isRequired,\n  requiredObjectWithShape: PropTypes.shape({\n    optionalProperty: PropTypes.string,\n    requiredProperty: PropTypes.number.isRequired,\n  }).isRequired,\n  requiredObjectWithStrictShape: PropTypes.exact({\n    optionalProperty: PropTypes.string,\n    requiredProperty: PropTypes.number.isRequired,\n  }).isRequired,\n}\n';

    const OUTPUT =
      'import React from "react"\n\ninterface MyComponentProps {\n  optionalArray?: unknown[]\n  optionalBool?: boolean\n  optionalFunc?(...args: unknown[]): unknown\n  optionalNumber?: number\n  optionalObject?: object\n  optionalString?: string\n  optionalSymbol?: symbol\n  optionalNode?: React.ReactNode\n  optionalElement?: React.ReactElement\n  optionalElementType?: React.ElementType\n  optionalEnum?: "News" | "Photos"\n  optionalNumericEnum?: 1 | 2 | 3\n  optionalMixedEnum?: 1 | "Unknown" | false | unknown\n  optionalUnknownEnum?: unknown[]\n  optionalUnion?: string | number\n  optionalArrayOf?: number[]\n  optionalObjectOf?: Record<string, number>\n  optionalInstanceOf?: Message\n  optionalObjectWithShape?: {\n    optionalProperty?: string\n    requiredProperty: number\n    functionProperty?(...args: unknown[]): unknown\n  }\n  optionalObjectWithStrictShape?: {\n    optionalProperty?: string\n    requiredProperty: number\n  }\n  requiredArray: unknown[]\n  requiredBool: boolean\n  requiredFunc(...args: unknown[]): unknown\n  requiredNumber: number\n  requiredObject: object\n  requiredString: string\n  requiredSymbol: symbol\n  requiredNode: React.ReactNode\n  requiredElement: React.ReactElement\n  requiredElementType: React.ElementType\n  requiredEnum: "News" | "Photos"\n  requiredUnion: string | number\n  requiredArrayOf: number[]\n  requiredObjectOf: Record<string, number>\n  requiredInstanceOf: Message\n  requiredObjectWithShape: {\n    optionalProperty?: string\n    requiredProperty: number\n  }\n  requiredObjectWithStrictShape: {\n    optionalProperty?: string\n    requiredProperty: number\n  }\n}\n\nexport function MyComponent(props: MyComponentProps) {\n  return <span />\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {
      "preserve-prop-types": "unconverted",
    });
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("custom-validator", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport function MyComponent(props) {\n  return <span />\n}\n\nMyComponent.propTypes = {\n  a: PropTypes.string,\n  b: function () {},\n  c: () => {},\n  d: PropTypes.arrayOf(function() {}),\n  e: PropTypes.arrayOf(() => {}),\n  f: PropTypes.objectOf(function() {}),\n  g: PropTypes.objectOf(() => {}),\n  h: PropTypes.arrayOf(function() {}).isRequired,\n  i: PropTypes.arrayOf(() => {}).isRequired,\n  j: PropTypes.objectOf(function() {}).isRequired,\n  k: PropTypes.objectOf(() => {}).isRequired\n}\n';

    const OUTPUT =
      'import React from "react"\n\ninterface MyComponentProps {\n  a?: string\n  b?: unknown\n  c?: unknown\n  d?: unknown\n  e?: unknown\n  f?: unknown\n  g?: unknown\n  h: unknown\n  i: unknown\n  j: unknown\n  k: unknown\n}\n\nexport function MyComponent(props: MyComponentProps) {\n  return <span />\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("extended-props", () => {
    const INPUT =
      'import BaseComponent from "./base"\nimport React from "react"\n\nexport function MyComponent(props) {\n  return <span />\n}\n\nMyComponent.propTypes = BaseComponent.propTypes\n';

    const OUTPUT =
      'import BaseComponent from "./base"\nimport React from "react"\n\nexport function MyComponent(props) {\n  return <span />\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("forward-ref-and-func", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React, { forwardRef } from "react"\n\nexport const MyComponent = forwardRef((props, ref) => {\n  return <span ref={ref} />\n})\n\nMyComponent.propTypes = {\n  bar: PropTypes.string.isRequired,\n  foo: PropTypes.number,\n}\n\nexport function ComponentA(props) {\n  return <span />\n}\n\nComponentA.propTypes = {\n  a: PropTypes.string.isRequired,\n  b: PropTypes.number,\n}\n';

    const OUTPUT =
      'import React, { forwardRef } from "react"\n\ninterface MyComponentProps {\n  bar: string\n  foo?: number\n}\n\nexport const MyComponent = forwardRef<HTMLElement, MyComponentProps>((props, ref) => {\n  return <span ref={ref} />\n})\n\ninterface ComponentAProps {\n  a: string\n  b?: number\n}\n\nexport function ComponentA(props: ComponentAProps) {\n  return <span />\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("forward-ref", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nconst MyComponent = React.forwardRef((props, ref) => {\n  return <span ref={ref} />\n})\n\nMyComponent.propTypes = {\n  bar: PropTypes.string.isRequired,\n  foo: PropTypes.number,\n}\n\nexport default MyComponent\n';

    const OUTPUT =
      'import React from "react"\n\ninterface MyComponentProps {\n  bar: string\n  foo?: number\n}\n\nconst MyComponent = React.forwardRef<HTMLElement, MyComponentProps>((props, ref) => {\n  return <span ref={ref} />\n})\n\nexport default MyComponent\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("function-and-class", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport function ComponentA(props) {\n  return <span />\n}\n\nComponentA.propTypes = {\n  a: PropTypes.string.isRequired,\n  b: PropTypes.number,\n}\n\nexport class ComponentB extends React.Component {\n  render() {\n    return <span />\n  }\n}\n\nComponentB.propTypes = {\n  c: PropTypes.array,\n  d: PropTypes.object.isRequired,\n}\n';

    const OUTPUT =
      'import React from "react"\n\ninterface ComponentAProps {\n  a: string\n  b?: number\n}\n\nexport function ComponentA(props: ComponentAProps) {\n  return <span />\n}\n\ninterface ComponentBProps {\n  c?: unknown[]\n  d: object\n}\n\nexport class ComponentB extends React.Component<ComponentBProps> {\n  render() {\n    return <span />\n  }\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("function-component", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport function MyComponent(props) {\n  return <span />\n}\n\nMyComponent.propTypes = {\n  bar: PropTypes.string.isRequired,\n  foo: PropTypes.number,\n}\n';

    const OUTPUT =
      'import React from "react"\n\ninterface MyComponentProps {\n  bar: string\n  foo?: number\n}\n\nexport function MyComponent(props: MyComponentProps) {\n  return <span />\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("literal-prop", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport function MyComponent(props) {\n  return <span />\n}\n\nMyComponent.propTypes = {\n  \'data-testid\': PropTypes.string,\n}\n';

    const OUTPUT =
      "import React from \"react\"\n\ninterface MyComponentProps {\n  'data-testid'?: string\n}\n\nexport function MyComponent(props: MyComponentProps) {\n  return <span />\n}\n";

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("memo-export", () => {
    const INPUT =
      "import PropTypes from 'prop-types'\nimport React from 'react'\n\nexport const MyComponent = React.memo(function MyComponent(props) {\n  return null\n})\n\nMyComponent.propTypes = {\n  a: PropTypes.number\n}\n";

    const OUTPUT =
      "import React from 'react'\n\ninterface MyComponentProps {\n  a?: number\n}\n\nexport const MyComponent = React.memo(function MyComponent(props: MyComponentProps) {\n  return null\n})\n";

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("memo", () => {
    const INPUT =
      "import PropTypes from 'prop-types'\nimport React from 'react'\n\nconst MyComponent = React.memo(function MyComponent(props) {\n  return null\n})\n\nMyComponent.propTypes = {\n  a: PropTypes.number\n}\n";

    const OUTPUT =
      "import React from 'react'\n\ninterface MyComponentProps {\n  a?: number\n}\n\nconst MyComponent = React.memo(function MyComponent(props: MyComponentProps) {\n  return null\n})\n";

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("multiple-class-components-static", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport class ComponentA extends React.Component {\n  static propTypes = {\n    a: PropTypes.string.isRequired,\n    b: PropTypes.number,\n  }\n\n  render() {\n    return <span />\n  }\n}\n\nexport class ComponentB extends React.Component {\n  static propTypes = {\n    c: PropTypes.array,\n    d: PropTypes.object.isRequired,\n  }\n\n  render() {\n    return <span />\n  }\n}\n';

    const OUTPUT =
      'import React from "react"\n\ninterface ComponentAProps {\n  a: string\n  b?: number\n}\n\nexport class ComponentA extends React.Component<ComponentAProps> {\n  render() {\n    return <span />\n  }\n}\n\ninterface ComponentBProps {\n  c?: unknown[]\n  d: object\n}\n\nexport class ComponentB extends React.Component<ComponentBProps> {\n  render() {\n    return <span />\n  }\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("multiple-components", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport function ComponentA(props) {\n  return <span />\n}\n\nComponentA.propTypes = {\n  a: PropTypes.string.isRequired,\n  b: PropTypes.number,\n}\n\nexport function ComponentB(props) {\n  return <span />\n}\n\nComponentB.propTypes = {\n  c: PropTypes.array,\n  d: PropTypes.object.isRequired,\n}\n';

    const OUTPUT =
      'import React from "react"\n\ninterface ComponentAProps {\n  a: string\n  b?: number\n}\n\nexport function ComponentA(props: ComponentAProps) {\n  return <span />\n}\n\ninterface ComponentBProps {\n  c?: unknown[]\n  d: object\n}\n\nexport function ComponentB(props: ComponentBProps) {\n  return <span />\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("no-export", () => {
    const INPUT =
      "import PropTypes from 'prop-types'\nimport React from 'react'\n\nfunction MyComponent(props) {\n  return null\n}\n\nMyComponent.propTypes = {\n  a: PropTypes.number\n}\n";

    const OUTPUT =
      "import React from 'react'\n\ninterface MyComponentProps {\n  a?: number\n}\n\nfunction MyComponent(props: MyComponentProps) {\n  return null\n}\n";

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("no-prop-types", () => {
    const INPUT =
      'import React from "react"\n\nexport function MyComponent(props) {\n  return <span />\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(actualOutput, undefined);
  });

  it("odd-required", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport const MyComponent = (props) => {\n  return <span />\n}\n\nMyComponent.propTypes = {\n  a: PropTypes.arrayOf(PropTypes.shape({\n    name: PropTypes.number.isRequired\n  }).isRequired),\n  b: PropTypes.objectOf(PropTypes.number.isRequired)\n}\n';

    const OUTPUT =
      'import React from "react"\n\ninterface MyComponentProps {\n  a?: {\n    name: number\n  }[]\n  b?: Record<string, number>\n}\n\nexport const MyComponent = (props: MyComponentProps) => {\n  return <span />\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("preserve-none", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport function ComponentA(props) {\n  return <span />\n}\n\nComponentA.propTypes = {\n  ...OtherComponent,\n  a: PropTypes.string.isRequired,\n  b() {}\n}\n\nexport function ComponentB(props) {\n  return <span />\n}\n\nComponentB.propTypes = {\n  ...ThisComponent,\n  c: PropTypes.number,\n  d() {}\n}\n';

    const OUTPUT =
      'import React from "react"\n\ninterface ComponentAProps {\n  a: string\n  b?: unknown\n}\n\nexport function ComponentA(props: ComponentAProps) {\n  return <span />\n}\n\ninterface ComponentBProps {\n  c?: number\n  d?: unknown\n}\n\nexport function ComponentB(props: ComponentBProps) {\n  return <span />\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("preserve-prop-types", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport function MyComponent(props) {\n  return <span />\n}\n\nMyComponent.propTypes = {\n  bar: PropTypes.string.isRequired,\n  foo: PropTypes.number,\n}\n';

    const OUTPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\ninterface MyComponentProps {\n  bar: string\n  foo?: number\n}\n\nexport function MyComponent(props: MyComponentProps) {\n  return <span />\n}\n\nMyComponent.propTypes = {\n  bar: PropTypes.string.isRequired,\n  foo: PropTypes.number,\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {
      "preserve-prop-types": "all",
    });
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("preserve-unconverted-shape", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport function MyComponent(props) {\n  return <span />\n}\n\nMyComponent.propTypes = {\n  a: PropTypes.string,\n  b: function () {},\n  c: PropTypes.shape({\n    d: PropTypes.bool\n  })\n}\n';

    const OUTPUT =
      'import React from "react"\n\ninterface MyComponentProps {\n  a?: string\n  b?: unknown\n  c?: {\n    d?: boolean\n  }\n}\n\nexport function MyComponent(props: MyComponentProps) {\n  return <span />\n}\n\nMyComponent.propTypes = {\n  b: function () {}\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {
      "preserve-prop-types": "unconverted",
    });
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("preserve-unconverted-static", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport class MyComponent extends React.Component {\n  static propTypes = {\n    bar: PropTypes.string.isRequired,\n    foo() {}\n  }\n\n  render() {\n    return <span />\n  }\n}\n';

    const OUTPUT =
      'import React from "react"\n\ninterface MyComponentProps {\n  bar: string\n  foo?: unknown\n}\n\nexport class MyComponent extends React.Component<MyComponentProps> {\n  static propTypes = {\n    foo() {}\n  }\n\n  render() {\n    return <span />\n  }\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {
      "preserve-prop-types": "unconverted",
    });
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("preserve-unconverted", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport function MyComponent(props) {\n  return <span />\n}\n\nMyComponent.propTypes = {\n  ...OtherComponent.propTypes,\n  a: PropTypes.string,\n  b: function () {},\n  c: () => {},\n  d: PropTypes.arrayOf(function() {}),\n  e: PropTypes.arrayOf(() => {}),\n  f: PropTypes.objectOf(function() {}),\n  g: PropTypes.objectOf(() => {}),\n}\n';

    const OUTPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\ninterface MyComponentProps {\n  a?: string\n  b?: unknown\n  c?: unknown\n  d?: unknown\n  e?: unknown\n  f?: unknown\n  g?: unknown\n}\n\nexport function MyComponent(props: MyComponentProps) {\n  return <span />\n}\n\nMyComponent.propTypes = {\n  ...OtherComponent.propTypes,\n  b: function () {},\n  c: () => {},\n  d: PropTypes.arrayOf(function() {}),\n  e: PropTypes.arrayOf(() => {}),\n  f: PropTypes.objectOf(function() {}),\n  g: PropTypes.objectOf(() => {})\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {
      "preserve-prop-types": "unconverted",
    });
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("spread-element", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport function MyComponent(props) {\n  return <span />\n}\n\nMyComponent.propTypes = {\n  ...OtherComponent.propTypes,\n  a: PropTypes.string,\n}\n';

    const OUTPUT =
      'import React from "react"\n\ninterface MyComponentProps {\n  a?: string\n}\n\nexport function MyComponent(props: MyComponentProps) {\n  return <span />\n}\n\nMyComponent.propTypes = {\n  ...OtherComponent.propTypes\n}\n';

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {
      "preserve-prop-types": "unconverted",
    });
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });

  it("typescript", () => {
    const INPUT =
      'import PropTypes from "prop-types"\nimport React from "react"\n\nexport function MyComponent(props) {\n  const foo: string = \'bar\'\n  return <span />\n}\n\nMyComponent.propTypes = {\n  bar: PropTypes.string.isRequired,\n  foo: PropTypes.number,\n}\n';

    const OUTPUT =
      "import React from \"react\"\n\ninterface MyComponentProps {\n  bar: string\n  foo?: number\n}\n\nexport function MyComponent(props: MyComponentProps) {\n  const foo: string = 'bar'\n  return <span />\n}\n";

    const fileInfo = {
      path: "index.js",
      source: INPUT,
    };

    const actualOutput = transform(fileInfo, buildApi("tsx"), {});
    assert.deepEqual(
      actualOutput?.replace(/\W/gm, ""),
      OUTPUT.replace(/\W/gm, "")
    );
  });
});
