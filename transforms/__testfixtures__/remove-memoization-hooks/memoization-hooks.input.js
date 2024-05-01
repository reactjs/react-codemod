import React from 'react';

function Component() {
  const state = React.useState();

  const example1 = React.useMemo(() => {
    const diff = today.diff(selectedDate, "days");
    return diff > 3 || diff < -3;
  }, [today, selectedDate]);

  const example2 = React.useCallback(() => {
    const diff = today.diff(selectedDate, "days");
    return diff > 3 || diff < -3;
  }, [today, selectedDate]);
}

const MyComponent = ({ name }) => {
  return <div>Hello, {name}!</div>;
};
  
const MemoizedMyComponent = React.memo(MyComponent);