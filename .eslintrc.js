module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': 'off',
    'consistent-return': 'off',
    'array-callback-return': 'off',
    'no-undef': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
