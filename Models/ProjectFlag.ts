export enum PROJECT_FLAG_STATE {
	PENDING,
	ACCEPTED,
	DENIED,
}

export enum PROJECT_FLAG_REQUEST {
	COPYRIGHT = "Copyright",
	MISINFORMATION = "Misinformation",
	FAKE = "Fake",
	INCORRECT_DIFFICULTY = "Incorrect Difficulty",
	ILLEGAL = "Illegal",
	SEXUAL_CONTENT = "Sexual Content",
	ABUSIVE = "Abusive",
	HAZARDOUS = "Hazardous",
}

export type ProjectFlag = {
	id: string;
	dateRequested: Date;
	userId: string;
	state: PROJECT_FLAG_STATE;
	request: PROJECT_FLAG_REQUEST;
	additionalInformation: string;
};

export type DbProjectFlag = {
	id: string;
	dateRequested: number;
	userId: string;
	state: PROJECT_FLAG_STATE;
	request: PROJECT_FLAG_REQUEST;
	additionalInformation: string;
};

export const projectFlagRequestTypeFromString = (
	value: string
): PROJECT_FLAG_REQUEST => {
	switch (value) {
		case "Abusive":
			return PROJECT_FLAG_REQUEST.ABUSIVE;
		case "Copyright":
			return PROJECT_FLAG_REQUEST.COPYRIGHT;
		case "Fake":
			return PROJECT_FLAG_REQUEST.FAKE;
		case "Hazardous":
			return PROJECT_FLAG_REQUEST.HAZARDOUS;
		case "Illegal":
			return PROJECT_FLAG_REQUEST.ILLEGAL;
		case "Incorrect Difficulty":
			return PROJECT_FLAG_REQUEST.INCORRECT_DIFFICULTY;
		case "Misinformation":
			return PROJECT_FLAG_REQUEST.MISINFORMATION;
		case "Sexual Content":
			return PROJECT_FLAG_REQUEST.SEXUAL_CONTENT;
		default:
			return PROJECT_FLAG_REQUEST.INCORRECT_DIFFICULTY;
	}
};

export const projectFlagToDbProject = (project: ProjectFlag): DbProjectFlag => {
	return {
		...project,
		dateRequested: project.dateRequested.getTime(),
	};
};

export const projectFlagFromDbProject = (
	dbProject: DbProjectFlag
): ProjectFlag => {
	return {
		...dbProject,
		dateRequested: new Date(dbProject.dateRequested),
	};
};
