import { forwardRef } from 'react';

const MyComponent = forwardRef(function Component(
  myProps: Props,
  myRef: React.ForwardedRef<HTMLButtonElement>
) {
  return null;
});