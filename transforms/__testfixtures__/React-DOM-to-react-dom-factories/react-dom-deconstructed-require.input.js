const React = require('react');
const ReactDOM = require('ReactDOM');
const {
  Component,
  DOM
} = React;

class Hello extends Component {
  render() {
    return DOM.div(null, `Hello ${this.props.toWhat}`);
  }
}
