import { forwardRef } from 'react';
type Props = { a: 1 };

const MyInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return null;
});