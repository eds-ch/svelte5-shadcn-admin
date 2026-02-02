export function simulateServer<T>(value: T, ms = 400): Promise<T> {
	return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
