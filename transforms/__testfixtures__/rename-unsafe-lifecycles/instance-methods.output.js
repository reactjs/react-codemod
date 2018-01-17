const React = require('React');

class ClassComponent extends React.Component {
  UNSAFE_componentWillMount() {
    // componentWillMount
  }
  componentDidMount() {
    // componentDidMount
  }
  UNSAFE_componentWillUpdate(nextProps, nextState) {
    // componentWillUpdate
  }
  componentDidUpdate(prevProps, prevState) {
    // componentDidUpdate
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // componentWillReceiveProps
  }
  componentWillUnmount() {
    // componentWillUnmount
  }
  render() {
    // render
  }
}