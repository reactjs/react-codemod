const createReactClass = require('create-react-class');

const MyComponent = createReactClass({
  displayName: 'MyComponent',
  mixins: [
    {
      unsafe_componentWillMount() {
        // componentWillMount
      },
      componentDidMount() {
        // componentDidMount
      },
      unsafe_componentWillUpdate(nextProps, nextState) {
        // componentWillUpdate
      },
      componentDidUpdate(prevProps, prevState) {
        // componentDidUpdate
      },
      unsafe_componentWillReceiveProps(nextProps) {
        // componentWillReceiveProps
      },
      componentWillUnmount() {
        // componentWillUnmount
      },
    },
  ],
  unsafe_componentWillMount() {
    // componentWillMount
  },
  componentDidMount() {
    // componentDidMount
  },
  unsafe_componentWillUpdate(nextProps, nextState) {
    // componentWillUpdate
  },
  componentDidUpdate(prevProps, prevState) {
    // componentDidUpdate
  },
  unsafe_componentWillReceiveProps(nextProps) {
    // componentWillReceiveProps
  },
  componentWillUnmount() {
    // componentWillUnmount
  },
  render() {
    // render
  },
});