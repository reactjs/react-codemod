module.exports = function(file, api) {
  var j = api.jscodeshift;
  var root = j(file.source);

  return root
    .find(j.ImportDeclaration, {
      type: 'ImportDeclaration',
      source: {
        type: 'Literal',
        value: '@nfl/gridiron',
      },
    })
    .forEach(p => j(p).replaceWith())
    .toSource();
};