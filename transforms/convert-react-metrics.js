module.exports = function (file, api) {
    const j = api.jscodeshift;

    return j(file.source)
        .find(j.ImportDeclaration, {
            source: {
                value: "@nfl/react-metrics"
            }
        })
        .forEach(p => {
            p.node.source.value = `react-metrics`;
        })
        .toSource();
};
