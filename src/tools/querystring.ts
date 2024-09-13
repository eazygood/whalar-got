export function parseBoolean(value: string | undefined): boolean {
	if (value === undefined) return false;
	return value.toLowerCase() === 'true';
}
