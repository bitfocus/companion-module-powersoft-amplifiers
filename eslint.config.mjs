import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

export default generateEslintConfig({
	enableTypescript: true,
	ignorePatterns: ['.yarn/**', 'scripts/**'],
})
