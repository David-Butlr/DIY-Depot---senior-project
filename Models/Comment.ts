export type Comment = {
	id: string;
	userId: string;
	userName: string;
	userPhotoURL: string;
	text: string;
	dateCreated: Date;
	dateUpdated: Date;
};

export type DbComment = {
	id: string;
	userId: string;
	userName: string;
	userPhotoURL: string;
	text: string;
	dateCreated: number;
	dateUpdated: number;
};

export const commentToDBComment = (comment: Comment): DbComment => {
	return {
		...comment,
		dateCreated: comment.dateCreated.getTime(),
		dateUpdated: comment.dateUpdated.getTime(),
	};
};

export const commentFromDBComment = (comment: DbComment): Comment => {
	return {
		...comment,
		dateCreated: new Date(comment.dateCreated),
		dateUpdated: new Date(comment.dateUpdated),
	};
};

export const createBlankComment = (userId: string): Comment => {
	return {
		id: "",
		userId: userId,
		userName: "",
		userPhotoURL: "",
		text: "",
		dateCreated: new Date(),
		dateUpdated: new Date(),
	};
};
