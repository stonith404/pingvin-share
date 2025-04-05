import { defineConfig } from "eslint/config";
import react from "eslint-plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("next", "eslint-config-next", "eslint:recommended", "prettier"),

    plugins: {
        react,
    },

    rules: {
        quotes: ["warn", "double", {
            allowTemplateLiterals: true,
        }],

        "react-hooks/exhaustive-deps": ["off"],
        "import/no-anonymous-default-export": ["off"],
        "no-unused-vars": ["warn"],
        "react/no-unescaped-entities": ["off"],
        "@next/next/no-img-element": ["off"],
    },
}]);