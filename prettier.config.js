/**
 * @type {import("prettier").Config}
 */
const config = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	semi: true,
	bracketSameLine: false,
	overrides: [
		{
			files: ['*.md'],
			options: { useTabs: false, proseWrap: 'preserve' }
		}
	]
};

export default config;
