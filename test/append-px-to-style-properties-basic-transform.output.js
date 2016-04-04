import React from 'react';

class Cool extends React.Component {
  render() {
    const style = { height: '10px', width: '10px', flex: 1 };
    const style2 = { height: '20px', width: '20px' };
    return <div style={{fontSize: '10px'}}><div style={style}>Hello</div><div style={style2}>Hello</div></div>;
  }
}
