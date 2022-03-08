require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: "kinetics",
  root: true,
  env: {
    node: true,
    jest: true,
  },
};
