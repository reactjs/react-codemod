const React = require('react');

class Hello extends React.Component {
  render() {
    return React.DOM.div(null, `Hello ${this.props.toWhat}`);
  }
}
