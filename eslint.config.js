import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{ ignores: ['dist', 'coverage', 'node_modules', '.vercel'] },
	{
		files: ['**/*.{ts,tsx}'],
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		languageOptions: {
			ecmaVersion: 2022,
			globals: globals.browser
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			]
		}
	},
	{
		files: ['api/**/*.js'],
		languageOptions: {
			ecmaVersion: 2022,
			globals: globals.node
		},
		rules: {
			'no-undef': 'off'
		}
	},
	{
		files: ['*.config.{js,ts}', 'eslint.config.js'],
		languageOptions: {
			globals: globals.node
		}
	},
	{
		files: ['tests/**/*.{ts,tsx}'],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		}
	}
);
