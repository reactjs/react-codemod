export default function FunctionExpressionInput(): JSX.Element {
  const x = 'y';
  if (true) {
    return <div>Anonymous function</div>;
  }
  return null;
}
