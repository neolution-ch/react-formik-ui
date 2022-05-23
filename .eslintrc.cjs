module.exports = {
  env: {
    node: true,
    jest: true,
    browser: true,
  },
  extends: ["eslint:recommended", "plugin:import/recommended", "prettier", "plugin:storybook/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["tsconfig.json"],
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  ignorePatterns: ["dist"],
  globals: {
    React: true,
    JSX: true,
  },
  // rules we want to enforce or disable
  rules: {
    // https://github.com/typescript-eslint/typescript-eslint/issues/2621
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    // Doesn't work with our neolution-ch packages
    "import/named": "off",
    "import/no-unresolved": "off",
    "import/default": "off",
    "import/no-duplicates": "off",
    "import/namespace": "off",
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "off",
    // Enforce double quotes
    quotes: [
      "error",
      "double",
      {
        avoidEscape: true,
      },
    ],
    // Prefer string interpolation
    "prefer-template": "error",
    "max-lines": [
      "error",
      {
        max: 200,
      },
    ],
    complexity: [
      "error",
      {
        max: 12,
      },
    ],
    "prefer-destructuring": "error",
    "no-empty-function": "error",
    "arrow-body-style": ["error", "as-needed"],
  },
};
