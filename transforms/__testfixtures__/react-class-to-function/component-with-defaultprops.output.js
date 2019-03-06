import React from "react";
import { string, number } from "prop-types";

export default function ReactExample({ foo, bar }) {
return (
  <div>
    {foo}
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