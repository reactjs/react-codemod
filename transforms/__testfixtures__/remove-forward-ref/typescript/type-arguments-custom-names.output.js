const MyComponent = function Component(
  {
    ref: myRef,
    ...myProps
  }: Props & {
    ref?: React.Ref<HTMLButtonElement>
  }
) {
  return null;
};