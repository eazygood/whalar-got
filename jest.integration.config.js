const baseConfig = require('./jest.config.js');

module.exports = {
	...baseConfig,
	displayName: 'integration-tests',
	testMatch: ['<rootDir>/test/integration/**/*.test.(js|ts)'], // Match only integration test files
	collectCoverage: true,
	collectCoverageFrom: [
		'src/**/*.{js,ts}', // Include your source files for integration tests
	],
	coverageDirectory: 'coverage/integration', // Save integration test coverage in a separate folder
};
