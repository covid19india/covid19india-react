module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'google',
    'eslint-config-prettier',
  ],
  overrides: [
    {
      files: ['*.test.js'],
      extends: ['plugin:jest/recommended'],
    },
    {
      files: ['serviceWorker.js'],
      env: {
        browser: true,
        node: true,
      },
    },
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'require-jsdoc': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
