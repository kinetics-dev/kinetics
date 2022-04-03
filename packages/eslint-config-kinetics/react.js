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
  extends: ["react-app", "eslint-config-kinetics/shared"],
  rules: {
    "react/jsx-boolean-value": ["error", "never"],
    "react/jsx-no-bind": "warn", // performance
  },
};
