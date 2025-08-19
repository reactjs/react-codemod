import React from "react";

type MetaProps = { item: string };

const Meta = React.forwardRef<
  React.ElementRef<typeof Span>,
  React.ComponentPropsWithRef<typeof Span> & MetaProps
>(({ item: itemProp, asChild, ...rest }, ref) => {
  return null;
});