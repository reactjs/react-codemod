import React from 'react';

class Cool extends React.Component {
  render() {
    const style = { height: '10px', width: '10px', flex: 1 };
    const style2 = { height: '20px', width: '20px' };
    const style3 = { height: '10px', width: '10px', flex: 1 };
    const style4 = { height: '20px', width: '20px' };
    const style5 = Object.assign({}, style3, style4);
    return <div style={style5}><div style={style}>Hello</div><div style={style2}>Hello</div></div>;
  }
}