module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ["eslint:recommended", "plugin:security/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "commonjs",
  },
  rules: {
    "no-console": "off",
    "no-unused-vars": "warn",
    "security/detect-object-injection": "off",
  },
};
