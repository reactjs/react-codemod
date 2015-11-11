module.exports = function(file, api) {
  var j = api.jscodeshift;
  var root = j(file.source);

  root
    .find(j.ImportDeclaration, {
      type: 'ImportDeclaration',
      source: {
        type: 'Literal',
        value: '@nfl/gridiron',
      },
    })
    .forEach(p => j(p).replaceWith());

  return root.find(j.Identifier, {name: 'GridironComponent'})
    .forEach(p => {
      j(p).replaceWith(j.identifier('React.Component'));
    })
    .toSource();
};