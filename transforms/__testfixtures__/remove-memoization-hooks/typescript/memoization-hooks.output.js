import React from 'react';

function Component({ url }: { url: string }) {
  const state = React.useState<string>();

  const example1 = () => {
    const diff = today.diff(selectedDate, "days");
    return diff > 3 || diff < -3;
  };

  const example2 = () => {
    const diff = today.diff(selectedDate, "days");
    return diff > 3 || diff < -3;
  };
}

const MyComponent = ({ name } : { name: string }) => {
  return <div>Hello, {name}!</div>;
};
  
const MemoizedMyComponent: React.ReactNode = MyComponent;