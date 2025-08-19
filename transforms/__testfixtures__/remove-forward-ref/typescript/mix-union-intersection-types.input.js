import React from "react";

type BaseProps = { className?: string };
type MetaProps = { item: string };
type ButtonProps = { variant: 'primary' | 'secondary' };
type LinkProps = { href: string };

const Meta = React.forwardRef<
  HTMLDivElement,
  (BaseProps & MetaProps) | (ButtonProps & LinkProps) | ({ icon: 'home' | 'user' | 'settings' } & BaseProps)
>((props: (BaseProps & MetaProps) | (ButtonProps & LinkProps) | ({ icon: 'home' | 'user' | 'settings' } & BaseProps), ref) => {
  return null;
});