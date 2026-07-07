const MyComponent = function Component(
    {
        ref: myRef,
        ...myProps
    }: { a: 1 } & {
        ref?: React.Ref<unknown>
    }
) {
    return null;
};