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
  overrides: [
    {
      files: "**/*.{ts,tsx}",
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
        "@typescript-eslint/no-inferrable-types": [
          "error",
          { ignoreParameters: true },
        ],
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/ban-types": [
          "error",
          {
            types: {
              "String": {
                message: "Use string instead",
                fixWith: "string",
              },
              "Boolean": {
                message: "Use boolean instead",
                fixWith: "boolean",
              },
              "Number": {
                message: "Use number instead",
                fixWith: "number",
              },
              "Symbol": {
                message: "Use symbol instead",
                fixWith: "symbol",
              },
              "Function": {
                message: [
                  "The `Function` type accepts any function-like value.",
                  "It provides no type safety when calling the function, which can be a common source of bugs.",
                  "It also accepts things like class declarations, which will throw at runtime as they will not be called with `new`.",
                  "If you are expecting the function to accept certain arguments, you should explicitly define the function shape.",
                ].join("\n"),
              },

              // object typing
              "Object": {
                message: [
                  'The `Object` type actually means "any non-nullish value", so it is marginally better than `unknown`.',
                  '- If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.',
                  '- If you want a type meaning "any value", you probably want `unknown` instead.',
                ].join("\n"),
              },
              "{}": false,
              "object": {
                message: [
                  "The `object` type is currently hard to use ([see this issue](https://github.com/microsoft/TypeScript/issues/21732)).",
                  "Consider using `Record<string, unknown>` instead, as it allows you to more easily inspect and use the keys.",
                ].join("\n"),
              },
            },
          },
        ],
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-empty-function": "off",
        "tsdoc/syntax": "warn",
      },
    },
  ],
};
