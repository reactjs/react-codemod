/* @flow */

var React = require('react');

const justNeedKeys = {
  a: 12,
  b: 23,
};

class Component extends React.Component {
  props: {
    optionalMessage?: Message,
    optionalMessageOops?: $FlowFixMe,
    optionalEnum?: $FlowFixMe,
    optionalEnumOops?: $FlowFixMe,
    optionalUnion?: string | number | Message,
    optionalUnionOops?: $FlowFixMe,
    optionalUnionOops2?: $FlowFixMe,
    optionalArrayOf?: Array<number>,
    optionalObjectOf?: {[key: string]: number},
    optionalObjectWithShape?: {
      color?: string,
      fontSize?: $FlowFixMe,
      name?: $FlowFixMe,
    },
    optionalObjectWithShapeOops?: $FlowFixMe,
    optionalObjectWithShapeOops2?: $FlowFixMe,
    'is-literal-cool'?: boolean,
    'well-fine': number,
  };

  render() {
    return (
      <div>type safety</div>
    );
  }
}
