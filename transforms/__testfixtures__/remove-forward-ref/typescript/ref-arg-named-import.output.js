import type { ForwardedRef } from 'react';

const MyComponent = function Component(
  {
    ref: myRef,
    ...myProps
  }: Props & {
    ref?: React.Ref<HTMLDivElement>
  }
) {
  return null;
};
