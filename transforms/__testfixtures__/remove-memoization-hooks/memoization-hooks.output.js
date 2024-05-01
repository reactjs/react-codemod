import React from 'react';

function Component() {
  const state = React.useState();

  const example1 = () => {
    const diff = today.diff(selectedDate, "days");
    return diff > 3 || diff < -3;
  };

  const example2 = () => {
    const diff = today.diff(selectedDate, "days");
    return diff > 3 || diff < -3;
  };
}

const MyComponent = ({ name }) => {
  return <div>Hello, {name}!</div>;
};
  
const MemoizedMyComponent = MyComponent;
