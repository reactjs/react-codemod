const React = require('react');

class Component1 extends React.Component {
  static booleanPrim = true;
  static numberPrim = 12;
  static stringPrim = 'foo';
  static nullPrim = null;
  static undefinedPrim = undefined;
  booleanPrim = true;
  numberPrim = 12;
  stringPrim = 'foo';
  nullPrim = null;
  undefinedPrim = undefined;

  foobar = () => {
    return 123;
  };

  componentDidMount() {
    console.log('hello');
  }

  render() {
    return <div />;
  }
}
