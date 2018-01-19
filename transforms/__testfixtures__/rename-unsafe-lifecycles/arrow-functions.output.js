const React = require('React');

class Component extends React.Component {
  UNSAFE_componentWillMount = logger('componentWillMount');
  componentDidMount = logger('componentDidMount');
  UNSAFE_componentWillReceiveProps = logger('componentWillReceiveProps');
  shouldComponentUpdate = logger('shouldComponentUpdate');
  UNSAFE_componentWillUpdate = logger('componentWillUpdate');
  componentDidUpdate = logger('componentDidUpdate');
  componentWillUnmount = logger('componentWillUnmount');
  render() {
    return null;
  }
}