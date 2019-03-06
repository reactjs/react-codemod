import React from "react";
import { string, number } from "prop-types";

export default function ReactExample({ foo, bar }) {
const test = bar === 2;
return (
  <div>
    {test}
    {bar}
  </div>
);   
};

ReactExample.propTypes = {
  foo: string,
  bar: number
};

ReactExample.defaultProps = {
  foo: "test",
  bar: 2
};