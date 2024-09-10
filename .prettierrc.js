const defaults = require('./prettier.config.js');

module.exports = {
	...defaults,
	singleQuote: true,
	trailingComma: 'all',
	printWidth: 100,
	quoteProps: 'consistent',
	arrowParens: 'always',
};
