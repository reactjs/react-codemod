var React = require('react');

const render = () => {
  return /*1*//*4*//*2*//*3*/</*5*/div/*6*//*7*//*18*/
    /*8*/className/*9*/=/*10*/"foo"/*11*/
    /*12*/
    /*13*///17
    onClick/*14*/={/*15*/ this.handleClick}/*16*/>
    {/*19*///25
    </*20*/TodoList/*21*/./*22*/Item/*23*/ />/*24*/}
    <span {.../*26*/getProps()/*27*/} />
    <input /*28*//*29*/ />
  </div>;
};

const render2 = () => {
  return <div
    // Prop comment.
    className="foo">
    {// Child string comment.
    'hello'}
  </div>;
};

const render3 = () => {
  return <div>
    {// Child element comment.
    <span />}
  </div>;
};

const render4 = () => {
  return <Foo/* No props to see here! */ />;
};
