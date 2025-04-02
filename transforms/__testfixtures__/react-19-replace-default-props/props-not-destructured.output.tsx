const C = (props) => {
  props = {
    ...props,
    text: typeof props.text === "undefined" ? "Hello" : props.text,
    test: typeof props.test === "undefined" ? 2 : props.test,
    helloWorld: typeof props.helloWorld === "undefined" ? true : props.helloWorld
  };

  console.log(props.helloWorld);
  return <>{props.text}</>;
};
