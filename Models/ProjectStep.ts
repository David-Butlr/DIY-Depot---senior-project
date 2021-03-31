export enum PROJECT_STEP_TYPE {
	TEXT,
	PHOTO, // Text is required
	VIDEO, // Text is optional
}

export const getProjectStepTypeString = (type: PROJECT_STEP_TYPE): string => {
	switch (type) {
		case PROJECT_STEP_TYPE.TEXT:
			return "Text";
		case PROJECT_STEP_TYPE.PHOTO:
			return "Photo";
		case PROJECT_STEP_TYPE.VIDEO:
			return "Video";
		default:
			return "";
	}
};

export const getProjectStepTypeFromString = (
	type: string
): PROJECT_STEP_TYPE => {
	switch (type) {
		case "0":
			return PROJECT_STEP_TYPE.TEXT;
		case "1":
			return PROJECT_STEP_TYPE.PHOTO;
		case "2":
			return PROJECT_STEP_TYPE.VIDEO;
		default:
			return PROJECT_STEP_TYPE.TEXT;
	}
};

export type ProjectStep = {
	id: string; //guid
	type: PROJECT_STEP_TYPE;
	description: string;
	url: string;
};
