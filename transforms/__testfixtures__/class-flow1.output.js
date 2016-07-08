/* @flow */

var React = require('react');

class Component extends React.Component {
  props: {
    optionalArray?: Array<$FlowFixMe>,
    optionalBool?: boolean,
    optionalFunc?: Function,
    optionalNumber?: number,
    optionalObject?: Object,
    optionalString?: string,
    optionalNode?: $FlowFixMe,
    optionalElement?: $FlowFixMe,
    optionalMessage?: Message,
    optionalEnum?: 'News' | 'Photos' | 1 | true | null | void,
    optionalUnion?: string | number | Message,
    optionalArrayOf?: Array<number>,
    optionalObjectOf?: {[key: string]: number},
    optionalObjectOfRequiredField?: {[key: string]: number},
    requiredObjectOfRequiredField: {[key: string]: number},
    requiredObjectOfOptionalField: {[key: string]: number},
    optionalObjectWithShape?: {
      color?: string,
      fontSize: number,
    },
    requiredFunc: Function,
    requiredAny: any,
  };

  static propTypes = {
    optionalArray: React.PropTypes.array,
    optionalBool: React.PropTypes.bool,
    optionalFunc: React.PropTypes.func,
    optionalNumber: React.PropTypes.number,
    optionalObject: React.PropTypes.object,
    optionalString: React.PropTypes.string,
    optionalNode: React.PropTypes.node,
    optionalElement: React.PropTypes.element,
    optionalMessage: React.PropTypes.instanceOf(Message),
    optionalEnum: React.PropTypes.oneOf(['News', 'Photos', 1, true, null, undefined]),
    optionalUnion: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.instanceOf(Message),
    ]),
    optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),
    optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),
    optionalObjectOfRequiredField: React.PropTypes.objectOf(React.PropTypes.number.isRequired),
    requiredObjectOfRequiredField: React.PropTypes.objectOf(React.PropTypes.number.isRequired).isRequired,
    requiredObjectOfOptionalField: React.PropTypes.objectOf(React.PropTypes.number).isRequired,
    optionalObjectWithShape: React.PropTypes.shape({
      color: React.PropTypes.string,
      fontSize: React.PropTypes.number.isRequired,
    }),
    requiredFunc: React.PropTypes.func.isRequired,
    requiredAny: React.PropTypes.any.isRequired,
  };

  render() {
    return (
      <div>type safety</div>
    );
  }
}
