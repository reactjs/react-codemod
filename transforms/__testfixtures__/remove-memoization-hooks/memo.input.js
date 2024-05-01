import { memo } from 'react';

const MyComponent = ({ name }) => {
  return <div>Hello, {name}!</div>;
};
  
const MemoizedMyComponent = memo(MyComponent);