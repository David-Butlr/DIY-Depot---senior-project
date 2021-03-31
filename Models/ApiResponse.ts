export type APIResponse = {
	data: unknown;
	status: number;
};
export const createAPIResponseString = (
	data: unknown,
	status: number
): string => {
	return JSON.stringify({
		data,
		status,
	});
};
