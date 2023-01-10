module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    extraFileExtensions: [".svelte"], 
  },
  plugins: ['unused-imports'],
  extends: ['plugin:svelte/recommended', 'plugin:storybook/recommended', 'prettier'],
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  ],
  rules: {
    semi: [0, 'never'],
    'unused-imports/no-unused-imports': 'error',
    'jsx-a11y/click-events-have-key-events': 'off',
    "svelte/html-quotes": [
      "error",
      {
        "prefer": "double",
        "dynamic": {
          "quoted": false,
          "avoidInvalidUnquotedInHTML": false
        }
      }
    ],
    "svelte/no-useless-mustaches": [
      "error",
      {
        "ignoreIncludesComment": false,
        "ignoreStringEscape": false
      }
    ]
  },
};

