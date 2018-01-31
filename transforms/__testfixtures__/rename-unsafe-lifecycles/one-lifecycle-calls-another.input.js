const React = require('React');

class Component extends React.Component {
  componentWillMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps() {}
  render() {
    return null;
  }
}