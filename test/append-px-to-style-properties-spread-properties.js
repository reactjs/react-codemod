import React from 'react';

class Cool extends React.Component {
  render() {
    const style = { height: 10, width: 10, flex: 1 };
    const style2 = { height: 20, width: 20 };
    const style3 = {fontSize: 10, ...style1, ...style2};
    return <div style={style3}><div style={style}>Hello</div><div style={style2}>Hello</div></div>;
  }
}