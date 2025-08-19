import React from "react";

type BaseProps = { className?: string };
type MetaProps = { item: string };
type ButtonProps = { variant: 'primary' | 'secondary' };
type LinkProps = { href: string };

const Meta = (
  {
    ref,
    ...props
  }: (BaseProps & MetaProps) | (ButtonProps & LinkProps) | ({ icon: 'home' | 'user' | 'settings' } & BaseProps) & {
    ref: React.RefObject<HTMLDivElement>
  }
) => {
  return null;
};