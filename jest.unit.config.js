const baseConfig = require('./jest.config.js');
module.exports = {
	...baseConfig,
	displayName: 'unit-tests',
	testMatch: ['<rootDir>/test/unit/**/*.test.(js|ts)'], // Match only unit test files
	collectCoverage: true,
	collectCoverageFrom: [
		'src/**/*.{js,ts}', // Include your source files for unit tests
	],
	coverageDirectory: 'coverage/unit', // Save unit test coverage in a separate folder
};
