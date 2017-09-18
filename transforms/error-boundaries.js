module.exports = function(file, api, options) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.Identifier)
    .forEach(path => {
      if (path.node.name === 'unstable_handleError') {
        j(path).replaceWith(j.identifier('componentDidCatch'));
      }
    })
    .toSource();
};
