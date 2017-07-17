function belongsToClassExpression(path) {
  return (
    path.parentPath.value.type === "MethodDefinition" ||
    path.parentPath.value.type === "ClassProperty"
  );
}

function belongsToObjectExpression(path) {
  return (
    path.parentPath.parentPath.parentPath.value.type === "ObjectExpression"
  );
}

module.exports = function(file, api, options) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.Identifier)
    .forEach(path => {
      if (path.node.name === "unstable_handleError") {
        if (belongsToClassExpression(path) || belongsToObjectExpression(path)) {
          j(path).replaceWith(j.identifier("componentDidCatch"));
        }
      }
    })
    .toSource();
};
