import React from 'react';

const MyComponent = ({ name } : { name: string }) => {
  return <div>Hello, {name}!</div>;
};

const MemoizedMyComponent = MyComponent;