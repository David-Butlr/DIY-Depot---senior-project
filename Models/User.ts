export enum ROLES {
	ADMIN = "admin",
	MODERATOR = "moderator",
	USER = "user",
	TESTER = "tester",
	BANNED = "banned",
}

type BaseUser = {
	id: string;
	email: string;
	name: string;
	role: ROLES;
	photoURL: string;
};

export type User = {
	dbId: string;
	dateCreated: Date;
} & BaseUser;

export type DbUser = {
	dateCreated: number;
} & BaseUser;

export type APIUser = {
	dbId: string;
	dateCreated: string;
} & BaseUser;

export const userToDbUser = (user: User): DbUser => {
	return {
		...user,
		dateCreated: user.dateCreated.getTime(),
	};
};

export const userFromDbUser = (user: DbUser, dbId: string): User => {
	return {
		...user,
		dbId,
		dateCreated: new Date(user.dateCreated),
	};
};

export const userFromAPIUser = (user: APIUser): User => {
	return {
		...user,
		dateCreated: new Date(user.dateCreated),
	};
};

export const createBlankUser = (): User => ({
	id: "",
	dbId: "",
	name: "",
	email: "",
	role: ROLES.USER,
	photoURL: "",
	dateCreated: new Date(),
});

export const getUserRoleFromString = (role: string): ROLES => {
	switch (role) {
		case "admin":
			return ROLES.ADMIN;
		case "moderator":
			return ROLES.MODERATOR;
		case "tester":
			return ROLES.TESTER;
		case "banned":
			return ROLES.BANNED;
		default:
			return ROLES.USER;
	}
};

export const getRolesArray = (): ROLES[] => [
	ROLES.ADMIN,
	ROLES.MODERATOR,
	ROLES.USER,
	ROLES.TESTER,
	ROLES.BANNED,
];
