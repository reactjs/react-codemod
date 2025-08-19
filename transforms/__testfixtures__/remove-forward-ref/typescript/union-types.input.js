import React from "react";

type ButtonProps = { variant: 'primary' };
type LinkProps = { href: string };

const Element = React.forwardRef<
  HTMLElement,
  ButtonProps | LinkProps
>(({ variant, href, ...rest }, ref) => {
  return null;
});