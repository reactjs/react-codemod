import React from 'react';

class Cool extends React.Component {
  render() {
    const style = true ? { height: 10, width: 10, flex: 1 } : {};
    return (
      <div style={{fontSize: 10}}>
        <div style={style}>Hello</div>
        <div style={true ? {height: 40} : {width: 20}}>Hello</div>
      </div>
    );
  }
}