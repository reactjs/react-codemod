import ReactDOM from 'ReactDOM';
import {
  Component,
  DOM
} from 'react';

class Hello extends Component {
  render() {
    return DOM.div(null, `Hello ${this.props.toWhat}`);
  }
}
