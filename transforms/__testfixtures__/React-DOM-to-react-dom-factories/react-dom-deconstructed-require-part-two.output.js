const ReactDOM = require('ReactDOM');
const {
  Component,
  createElement
} = require('react');

class Hello extends Component {
  render() {
    return createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}
