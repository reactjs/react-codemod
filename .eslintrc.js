module.exports = {
  parser: 'babel-eslint',

  extends: './node_modules/fbjs-scripts/eslint/.eslintrc.js',

  plugins: [
    'react',
  ],

  rules: {
    'no-use-before-define': 2,
    'max-len': 'off'
  },
};
