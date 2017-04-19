const React = require('react');
const ReactDOM = require('ReactDOM');
const {
  Component,
  createElement
} = React;

class Hello extends Component {
  render() {
    return createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}
