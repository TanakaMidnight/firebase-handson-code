module.exports = {
    root: true,
    env: {
      browser: true,
      node: true
    },
    parserOptions: {
      sourceType: 'module',
      parser: 'babel-eslint',
      "ecmaVersion": 8
    },
    extends: [
      'plugin:vue/recommended',
      'prettier'
    ],
    plugins: [
      'vue',
      'prettier'
    ],
    // add your custom rules here
    rules: {
      "prettier/prettier": ["error", { 
        "singleQuote": true,
        "semi": false
      } ],
    },
    globals: {}
  }