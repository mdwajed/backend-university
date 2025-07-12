import js from "@eslint/js";
import plugin from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import { defineFlatConfig } from "eslint-define-config";
import globals from "globals";

export default defineFlatConfig([
  js.configs.recommended,

  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
        sourceType: "module",
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": plugin as any,
    },
    rules: {
      ...plugin.configs["recommended"].rules,
      ...plugin.configs["recommended-requiring-type-checking"].rules,
      "no-console": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unsafe-assignment": [
        "error",
        {
          ignorePattern: "^z\\.",
        },
      ],
    },
  },

  {
    ignores: ["dist", "node_modules", "eslint.config.ts"],
  },
]);
