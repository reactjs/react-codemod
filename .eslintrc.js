module.exports = {
  parser: 'babel-eslint',

  extends: './node_modules/fbjs-scripts/eslint/.eslintrc.js',

  plugins: [
    'react',
  ],

  ecmaFeatures: {
    modules: false
  },

  rules: {
    'no-use-before-define': 2,
  },
};
