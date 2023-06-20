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
  extends: ["react-app", "./shared"],
  rules: {
    "react/jsx-boolean-value": ["error", "never"],
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks: "(useRecoilCallback|useRecoilTransaction_UNSTABLE)",
      },
    ],
  },
};
