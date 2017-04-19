import ReactDOM from 'ReactDOM';
import {
  Component,
  createElement
} from 'react';

class Hello extends Component {
  render() {
    return createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}
