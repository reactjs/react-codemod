import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput({ onChange }, ref) {
  return <input ref={ref} onChange={onChange} />
});