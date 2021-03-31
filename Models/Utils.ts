export const getDateString = (date: Date | string | number): string => {
	const tempDate: Date =
		typeof date === "string" || typeof date === "number"
			? new Date(date)
			: date;
	return `${
		tempDate.getMonth() + 1
	}/${tempDate.getDate()}/${tempDate.getFullYear()}`;
};

export const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/;
