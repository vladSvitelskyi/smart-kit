// $ cat .eslintrc.js
module.exports = {
  'env': {
    'browser': true,
    'node': true,
    'es6': true,
    'jest': true
  },
  'extends': [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'sourceType': 'module'
  },
  'plugins': ['import'],
  'rules': {
    'import/no-unresolved': [2, { commonjs: true, amd: true }],
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'linebreak-style': 0,
    'no-console': 0,
    'no-unused-vars': 0,
    'func-names': 0,
    'no-trailing-spaces': 0,
    'consistent-return': 0,
    'prefer-arrow-callback': 0,
    'no-undef': 0,
    'no-unused-expressions': 0,
    'no-use-before-define': 0,
    'arrow-body-style': 0,
    'arrow-parens': 0,
    'no-underscore-dangle': 0,
    'class-methods-use-this': 0,
    'no-param-reassign': 0,
    'no-nested-ternary': 0,
    'function-paren-newline': 0
  },
}