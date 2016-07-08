/* @flow */

var React = require('react');

type SomeStuff<A> = { // TypeParameter
  fetch: () => Promise<A>,
};

var Component = React.createClass({
  statics: {
    notTyped: true,
    nothing: (null: null), // NullTypeAnnotation
    numberOrBool: (true: number | boolean),
    logger: (x: any): void => { console.log(x); },
    logger2: function(x: any): void {
      console.log(x);
    },
  },

  notTyped: true,
  foo: (12: number),
  bar: ('2000': string),
  handleClick: (null: ?(evt: any) => void),

  doStuff: function(x: number, y: boolean): boolean {
    return y && (x > 0);
  },

  componentDidMount: function() {
    this.handleClick = function(e) {
      console.log(e);
    };
  },

  render: function() {
    return (
      <div onClick={this.handleClick}>{this.foo}</div>
    );
  },
});
