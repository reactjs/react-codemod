const MyComp = ({foo = "hello", ...props}) => {
    props = {
        ...props,
        bar: typeof props.bar === "undefined" ? "bye" : props.bar,
        test: typeof props.test === "undefined" ? 2 : props.test
    };

    console.log(props.bar)
}
