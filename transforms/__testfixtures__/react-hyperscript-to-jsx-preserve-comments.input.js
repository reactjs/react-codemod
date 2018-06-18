var h = require('react-hyperscript');

const render = () => {
    return (
        /*1*//*4*//*2*//*3*/h('div', {
                /*8*/ className/*9*/: /*10*/"foo"/*11*/,
                /*12*/
                /*13*///17
                onClick/*14*/: /*15*/ this.handleClick/*16*/,
            }
            ,
            [
                h(TodoList.Item,//25
                {/*24*//*20*//*23*//*21*//*22*//*20*//*23*//*21*//*22*//*21*//*22*/}, []),
                h('span', {.../*26*/getProps()/*27*/}),
                h('input', {/*28*//*29*/})
                ,

            ])
        /*5*//*6*//*7*//*18*/
    )
};

const render2 = () => {
    return h('div', {// Prop comment.
        className:'foo'
        }, [
            // Child string comment.
        'hello'
    ])
};

const render3 = () => {
    return h('div', {}, [

        h(// Child element comment.
            'span')]

    )
};

const render4 = () => {
    return h(Foo)/* No props to see here! */;
};