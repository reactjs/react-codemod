import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';

const MyComponent = forwardRef(function Component(
  myProps: Props,
  myRef: ForwardedRef<HTMLDivElement>
) {
  return null;
});
