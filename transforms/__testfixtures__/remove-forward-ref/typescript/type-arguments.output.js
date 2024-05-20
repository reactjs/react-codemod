type Props = { a: 1 };

const MyInput = (
  {
    ref,
    ...props
  }: Props & {
    ref: React.RefObject<HTMLInputElement>
  }
) => {
  return null;
};