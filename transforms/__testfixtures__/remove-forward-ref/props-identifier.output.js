const MyInput = function MyInput(
  {
    ref,
    ...props
  }
) {
  return <input ref={ref} onChange={props.onChange} />
};