//replace enzyme react-17 adapter.js
export default (fileInfo, api) => {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);
    return root.find(j.ImportDeclaration, {
        type: "ImportDeclaration",
        source: {
          type: "Literal",
          value: "enzyme-adapter-react-16",
        },
      }).find(j.Literal).replaceWith(nodePath => {
        const {node} = nodePath;
        // console.log("*****", node.value);
        node.value = "@wojtekmaj/enzyme-adapter-react-17";
        // console.log("*****", node.value);
        return node;
    }).toSource();

};