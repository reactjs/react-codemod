import React from 'react';

class Cool extends React.Component {
  render() {
    const style = { height: 10, width: 10, flex: 1 };
    const style2 = { height: 20, width: 20 };
    return <div style={{fontSize: 10}}><div style={style}>Hello</div><div style={style2}>Hello</div></div>;
  }
}