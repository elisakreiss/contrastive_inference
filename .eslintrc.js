module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'jquery': true
  },
  'extends': [
    'standard'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
    '_': true,
    'exp': true,
    'Mustache': true,
    'config_deploy': true
  },
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
  'rules': {
    'semi': 'off'
  }
}
