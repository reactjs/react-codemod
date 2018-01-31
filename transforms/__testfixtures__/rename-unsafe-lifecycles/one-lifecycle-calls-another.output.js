const React = require('React');

class Component extends React.Component {
  UNSAFE_componentWillMount() {
    this.UNSAFE_componentWillReceiveProps(this.props);
  }
  UNSAFE_componentWillReceiveProps() {}
  render() {
    return null;
  }
}