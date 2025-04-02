const C = (props) => {
  console.log(props.helloWorld);
  return <>{props.text}</>;
};

C.defaultProps = {
  text: "Hello",
  test: 2,
  helloWorld: true,
};
