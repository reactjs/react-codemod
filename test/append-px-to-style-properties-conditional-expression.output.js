import React from 'react';

class Cool extends React.Component {
  render() {
    const style = true ? { height: '10px', width: '10px', flex: 1 } : {};
    return (
      <div style={{fontSize: '10px'}}>
        <div style={style}>Hello</div>
        <div style={true ? {height: '40px'} : {width: '20px'}}>Hello</div>
      </div>
    );
  }
}