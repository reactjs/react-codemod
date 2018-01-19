const createReactClass = require('create-react-class');

const MyComponent = createReactClass({
  displayName: 'MyComponent',
  mixins: [
    {
      UNSAFE_componentWillMount() {
        // componentWillMount
      },
      componentDidMount() {
        // componentDidMount
      },
      UNSAFE_componentWillUpdate(nextProps, nextState) {
        // componentWillUpdate
      },
      componentDidUpdate(prevProps, prevState) {
        // componentDidUpdate
      },
      UNSAFE_componentWillReceiveProps(nextProps) {
        // componentWillReceiveProps
      },
      componentWillUnmount() {
        // componentWillUnmount
      },
    },
  ],
  UNSAFE_componentWillMount() {
    // componentWillMount
  },
  componentDidMount() {
    // componentDidMount
  },
  UNSAFE_componentWillUpdate(nextProps, nextState) {
    // componentWillUpdate
  },
  componentDidUpdate(prevProps, prevState) {
    // componentDidUpdate
  },
  UNSAFE_componentWillReceiveProps(nextProps) {
    // componentWillReceiveProps
  },
  componentWillUnmount() {
    // componentWillUnmount
  },
  render() {
    // render
  },
});