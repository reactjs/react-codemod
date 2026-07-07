type Props = { a: 1 };

const MyInput = (
  {
    ref,
    ...props
  }: Props & {
    ref?: React.Ref<HTMLInputElement>
  }
) => {
  return null;
};