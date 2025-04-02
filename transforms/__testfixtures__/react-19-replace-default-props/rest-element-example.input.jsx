const MyComp = ({foo, ...props}) => {
    console.log(props.bar)
}

MyComp.defaultProps = { foo: "hello", bar: "bye", test: 2 };
