/* @flow */

var React = require('react');

type SomeStuff<A> = { // TypeParameter
  fetch: () => Promise<A>,
};

class Component extends React.Component {
  static notTyped = true;
  static nothing: null = null; // NullTypeAnnotation
  static numberOrBool: number | boolean = true;
  static logger = (x: any): void => { console.log(x); };

  static logger2(x: any): void {
    console.log(x);
  }

  notTyped = true;
  foo: number = 12;
  bar: string = '2000';
  handleClick: ?(evt: any) => void = null;

  doStuff = (x: number, y: boolean): boolean => {
    return y && (x > 0);
  };

  componentDidMount() {
    this.handleClick = function(e) {
      console.log(e);
    };
  }

  render() {
    return (
      <div onClick={this.handleClick}>{this.foo}</div>
    );
  }
}
