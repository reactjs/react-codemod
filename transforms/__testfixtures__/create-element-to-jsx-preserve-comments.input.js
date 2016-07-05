var React = require('react');

const render = () => {
  return /*1*/React/*2*/./*3*/createElement/*4*/(
    /*5*/'div'/*6*/,/*7*/
    {
      /*8*/className/*9*/: /*10*/'foo'/*11*/,/*12*/
      /*13*/onClick/*14*/:/*15*/ this.handleClick/*16*/, //17
    }/*18*/,
    /*19*/React.createElement(/*20*/TodoList/*21*/./*22*/Item/*23*/)/*24*/, //25
    React.createElement(
      'span',
      /*26*/getProps()/*27*/
    ),
    React.createElement('input', /*28*/null/*29*/)
  );
};

const render2 = () => {
  return React.createElement(
    'div', {
      className: 'foo',  // Prop comment.
    },
    'hello' // Child string comment.
  );
};

const render3 = () => {
  return React.createElement(
    'div',
    null,
    React.createElement('span') // Child element comment.
  );
};

const render4 = () => {
  return React.createElement(Foo, {/* No props to see here! */});
};
