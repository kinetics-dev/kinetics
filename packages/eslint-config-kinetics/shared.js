/*
 * @rushstack/eslint-patch is used to include plugins as dev
 * dependencies instead of imposing them as peer dependencies
 *
 * https://www.npmjs.com/package/@rushstack/eslint-patch
 */
require("@rushstack/eslint-patch/modern-module-resolution");

/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: ["eslint:recommended", "./typescript", "./prettier"],
  plugins: ["simple-import-sort", "import"],
  rules: {
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // The default grouping, but with type imports first as a separate
          // group, sorting that group like non-type imports are grouped.
          [
            "^node:.*\\u0000$",
            "^@?\\w.*\\u0000$",
            "^[^.].*\\u0000$",
            "^\\..*\\u0000$",
          ],
          // Side effect imports.
          ["^\\u0000"],
          // Node.js builtins prefixed with `node:`.
          ["^node:"],
          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          ["^@?\\w"],
          // Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything not matched in another group.
          ["^"],
          // Relative imports.
          // Anything that starts with a dot.
          ["^\\."],
        ],
      },
    ],
    "simple-import-sort/exports": "error",
    "sort-imports": "off",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "no-empty-function": "off",
  },
};
