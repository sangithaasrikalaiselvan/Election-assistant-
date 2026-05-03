import globals from "globals";
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["dist/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.jest,
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        TextDecoder: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-vars": "error",
      "react/prop-types": "off",
    },
  },
];
