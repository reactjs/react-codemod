const React = require('React');

class Component extends React.Component {
  componentWillMount = logger('componentWillMount');
  componentDidMount = logger('componentDidMount');
  componentWillReceiveProps = logger('componentWillReceiveProps');
  shouldComponentUpdate = logger('shouldComponentUpdate');
  componentWillUpdate = logger('componentWillUpdate');
  componentDidUpdate = logger('componentDidUpdate');
  componentWillUnmount = logger('componentWillUnmount');
  render() {
    return null;
  }
}