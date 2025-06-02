import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import typescriptSortKeys from "eslint-plugin-typescript-sort-keys";
import vitestPlugin from "eslint-plugin-vitest";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.sst/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/coverage/**",
      "**/.turbo/**",
      "**/.vercel/**",
      "**/.serverless/**",
      "**/.pnpm-store/**",
      "**/pnpm-lock.yaml",
      "**/package-lock.json",
      "**/yarn.lock",
      "**/.git/**",
      "**/.DS_Store",
    ],
  },
  eslint.configs.recommended,
  {
    files: ["infra/**/*.{js,ts}", "sst.config.ts"],
    languageOptions: {
      globals: {
        "$config": "readonly",
        "$app": "readonly",
        "$dev": "readonly",
        "$util": "readonly",
        "$asset": "readonly",
        "$concat": "readonly",
        "$interpolate": "readonly",
        "$jsonParse": "readonly",
        "$jsonStringify": "readonly",
        "$resolve": "readonly",
        "$transform": "readonly",
        "iamEdit": "readonly",
        "sst": "readonly",
      },
    },
  },
  {
    files: ["packages/**/*.{js,ts,jsx,tsx}", "infra/**/*.{js,ts}", "sst.config.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "import": importPlugin,
      "prettier": prettierPlugin,
      "simple-import-sort": simpleImportSort,
      "sort-destructure-keys": sortDestructureKeys,
      "typescript-sort-keys": typescriptSortKeys,
      "vitest": vitestPlugin,
    },
    rules: {
      "no-console": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { ignoreRestSiblings: true, argsIgnorePattern: "^_" },
      ],
      "import/no-unresolved": "off",
      "import/no-duplicates": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
      ],
      "sort-imports": "off",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["(?<!\\u0000)$", "(?<=\\u0000)$"],
            ["^\\.", "^\\..*\\u0000$"],
            ["^\\u0000"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "sort-destructure-keys/sort-destructure-keys": "error",
    },
  },
  {
    files: ["packages/**/value.ts"],
    rules: {
      "@typescript-eslint/no-namespace": "off",
    },
  },
  prettierConfig,
];