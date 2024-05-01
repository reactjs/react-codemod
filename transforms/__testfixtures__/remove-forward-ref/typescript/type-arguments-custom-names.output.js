const MyComponent = function Component(
  {
    ref: myRef,
    ...myProps
  }: Props & {
    ref: React.RefObject<HTMLButtonElement>
  }
) {
  return null;
};