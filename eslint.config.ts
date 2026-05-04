import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactRefresh from "eslint-plugin-react-refresh";

import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";

import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["node_modules/**"]),

	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		settings: {
			react: { version: "detect" },
		},
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			react.configs.flat.recommended,
		],
		languageOptions: { globals: globals.browser },
		rules: {
			"react/react-in-jsx-scope": "off",
		},
	},

	{
		files: ["**/*.tsx"],
		...reactRefresh.configs.vite,
	},

	eslintConfigPrettier,
]);
