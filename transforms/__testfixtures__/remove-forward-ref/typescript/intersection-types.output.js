import React from "react";

type MetaProps = { item: string };

const Meta = (
  {
    ref,
    item: itemProp,
    asChild,
    ...rest
  }: React.ComponentPropsWithRef<typeof Span> & MetaProps & {
    ref: React.RefObject<React.ElementRef<typeof Span>>
  }
) => {
  return null;
};