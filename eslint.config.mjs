import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    {
        ignores: [
            "**/dist/**",
            "**/.next/**",
            "**/node_modules/**",
            "**/coverage/**"
        ]
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: [
            "apps/api/**/*.{js,mjs,cjs,ts,tsx}",
            "back/**/*.{js,mjs,cjs,ts,tsx}",
            "packages/types/**/*.{js,mjs,cjs,ts,tsx}"
        ],
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    }
];
