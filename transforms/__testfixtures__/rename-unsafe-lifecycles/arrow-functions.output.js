const React = require('React');

class Component extends React.Component {
  unsafe_componentWillMount = logger('componentWillMount');
  componentDidMount = logger('componentDidMount');
  unsafe_componentWillReceiveProps = logger('componentWillReceiveProps');
  shouldComponentUpdate = logger('shouldComponentUpdate');
  unsafe_componentWillUpdate = logger('componentWillUpdate');
  componentDidUpdate = logger('componentDidUpdate');
  componentWillUnmount = logger('componentWillUnmount');
  render() {
    return null;
  }
}