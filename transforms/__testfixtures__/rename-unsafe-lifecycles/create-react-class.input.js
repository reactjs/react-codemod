const createReactClass = require('create-react-class');

const MyComponent = createReactClass({
  displayName: 'MyComponent',
  mixins: [
    {
      componentWillMount() {
        // componentWillMount
      },
      componentDidMount() {
        // componentDidMount
      },
      componentWillUpdate(nextProps, nextState) {
        // componentWillUpdate
      },
      componentDidUpdate(prevProps, prevState) {
        // componentDidUpdate
      },
      componentWillReceiveProps(nextProps) {
        // componentWillReceiveProps
      },
      componentWillUnmount() {
        // componentWillUnmount
      },
    },
  ],
  componentWillMount() {
    // componentWillMount
  },
  componentDidMount() {
    // componentDidMount
  },
  componentWillUpdate(nextProps, nextState) {
    // componentWillUpdate
  },
  componentDidUpdate(prevProps, prevState) {
    // componentDidUpdate
  },
  componentWillReceiveProps(nextProps) {
    // componentWillReceiveProps
  },
  componentWillUnmount() {
    // componentWillUnmount
  },
  render() {
    // render
  },
});