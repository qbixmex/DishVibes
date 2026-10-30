import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      'semi': 'warn',
      'react/jsx-handler-names': 'off',
      'indent': 'off',
      'camelcase': 'off',
      'no-tabs': 'off',
      '@next/next/no-img-element': 'off',
      'no-undef': 'off',
      'space-before-function-paren': 'off',
      'comma-dangle': ['warn', 'always-multiline'],
      '@next/next/no-html-link-for-pages': 'off',
      'multiline-ternary': 'off',
      'react/jsx-fragments': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
    },
  },
]);

export default eslintConfig;
