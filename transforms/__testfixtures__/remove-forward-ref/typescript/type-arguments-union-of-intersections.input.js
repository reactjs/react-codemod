import { forwardRef } from 'react';

const MyElement = forwardRef<HTMLDivElement, (BaseProps & MetaProps) | (ButtonProps & LinkProps)>((props, ref) => {
  return null;
});
