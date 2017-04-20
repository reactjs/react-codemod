const ReactDOM = require('ReactDOM');
const {
  Component,
  DOM
} = require('react');

class Hello extends Component {
  render() {
    return DOM.div(null, `Hello ${this.props.toWhat}`);
  }
}
