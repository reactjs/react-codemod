module.exports = {
  parser: '@typescript-eslint/parser',

  extends: './node_modules/fbjs-scripts/eslint/.eslintrc.js',

  plugins: [
    'react',
  ],

  rules: {
    'no-use-before-define': 2,
    'max-len': 'off'
  },
};
