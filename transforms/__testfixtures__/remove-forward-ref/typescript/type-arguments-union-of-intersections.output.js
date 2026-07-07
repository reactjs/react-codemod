const MyElement = (
  {
    ref,
    ...props
  }: ((BaseProps & MetaProps) | (ButtonProps & LinkProps)) & {
    ref?: React.Ref<HTMLDivElement>
  }
) => {
  return null;
};
