import { ProjectStep } from "./ProjectStep";
import { Tag } from "./Tag";
import {
	Comment,
	commentFromDBComment,
	commentToDBComment,
	DbComment,
} from "./Comment";
import {
	DbProjectFlag,
	ProjectFlag,
	projectFlagFromDbProject,
	projectFlagToDbProject,
} from "./ProjectFlag";

export enum PROJECT_TYPE {
	EXPO,
	TUTORIAL,
}

export enum PROJECT_STATE {
	DRAFT,
	IN_REVIEW,
	APPROVED,
	DENIED,
	DELETED,
}

export type Project = {
	id: string; // guid
	userId: string; //guid of user
	authorName: string,
	authorPhotoURL: string,
	reviewerId?: string; //guid for user who reviewed
	revisionNumber: number;
	dateCreated: Date;
	dateUpdated: Date;
	state: PROJECT_STATE;
	title: string;
	description: string;
	completedPhotoUrl: string;
	resources: string[];
	tags: Tag[];
	type: PROJECT_TYPE;
	steps: ProjectStep[];
	comments: Comment[];
	flags: ProjectFlag[];
};

export type DbProject = {
	id: string; // guid
	userId: string; //guid of user
	authorName: string,
	authorPhotoURL: string,
	reviewerId?: string; //guid for user who reviewed
	revisionNumber: number;
	dateCreated: number;
	dateUpdated: number;
	state: PROJECT_STATE;
	title: string;
	description: string;
	completedPhotoUrl: string;
	resources: string[];
	tags: Tag[];
	type: PROJECT_TYPE;
	steps: ProjectStep[];
	comments: DbComment[];
	flags: DbProjectFlag[];
};

export const projectToDbProject = (project: Project): DbProject => {
	return {
		...project,
		dateCreated: project.dateCreated.getTime(),
		dateUpdated: project.dateUpdated.getTime(),
		comments: (project.comments ?? []).map((c) => commentToDBComment(c)),
		flags: (project.flags ?? []).map((flag) =>
			projectFlagToDbProject(flag)
		),
	};
};

export const projectFromDbProject = (project: DbProject): Project => {
	return {
		...project,
		dateCreated: new Date(project.dateCreated),
		dateUpdated: new Date(project.dateUpdated),
		comments: (project.comments ?? []).map((c) => commentFromDBComment(c)),
		flags: (project.flags ?? []).map((flag) =>
			projectFlagFromDbProject(flag)
		),
	};
};

export const createBlankProject = (userId: string): Project => {
	return {
		id: "",
		userId,
		authorName: "",
		authorPhotoURL: "",
		reviewerId: undefined,
		revisionNumber: 0,
		dateCreated: new Date(),
		dateUpdated: new Date(),
		state: PROJECT_STATE.DRAFT,
		title: "",
		description: "",
		completedPhotoUrl: "",
		resources: [],
		tags: [],
		type: PROJECT_TYPE.TUTORIAL,
		steps: [],
		comments: [],
		flags: [],
	};
};

export const isValidProject = (project: Project): boolean => {
	if (project.title.length === 0) {
		throw "You must include a title";
	} else if (project.title.length > 150) {
		throw "Title must be less than 150 characters";
	} else if (project.description.length === 0) {
		throw "You must include a description";
	} else if (
		project.type === PROJECT_TYPE.TUTORIAL &&
		project.steps.length === 0
	) {
		throw "You must include at least one step for a tutorial";
	} else if (
		project.state === PROJECT_STATE.APPROVED ||
		project.state === PROJECT_STATE.DENIED ||
		project.state === PROJECT_STATE.DELETED
	) {
		throw "You must either create a project in state draft or in-review";
	} else if (project.completedPhotoUrl.length === 0) {
		throw "You must enter in a completed photo url";
	}
	return true;
};
