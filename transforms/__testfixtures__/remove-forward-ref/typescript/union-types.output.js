import React from "react";

type ButtonProps = { variant: 'primary' };
type LinkProps = { href: string };

const Element = (
  {
    ref,
    variant,
    href,
    ...rest
  }: ButtonProps | LinkProps & {
    ref: React.RefObject<HTMLElement>
  }
) => {
  return null;
};