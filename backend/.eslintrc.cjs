module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ["eslint:recommended", "plugin:security/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-console": "error",
    "security/detect-object-injection": "off",
  },
};
