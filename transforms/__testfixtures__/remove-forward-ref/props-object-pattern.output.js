const MyInput = function MyInput(
  {
    ref,
    onChange
  }
) {
  return <input ref={ref} onChange={onChange} />
};