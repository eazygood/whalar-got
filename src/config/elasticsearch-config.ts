export function elasticsearchConfig() {
	return {
		node: process.env.ELASTICSEARCH_URI,
	};
}
