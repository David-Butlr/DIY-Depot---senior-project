import { Application, Request, Response } from "express";
import { createAPIResponseString } from "../Models/ApiResponse";
import { ROLES, User } from "../Models/User";
import { getUserFromToken } from "./admin/user";

export const verifyUser = async (
	jwt: string | string[] | undefined,
	allowedRoles: ROLES[]
): Promise<User> => {
	if (!jwt || jwt.length === 0 || typeof jwt !== "string") {
		throw "Unauthorized";
	}
	const user = await getUserFromToken(jwt as string);
	if (!allowedRoles.includes(user.role)) {
		throw "Unauthorized";
	}
	return user;
};

// This will make sure a user is authenticated before they call certain routes
export const setupUserAuthRoutes = (app: Application): void => {
	app.post("*", (req: Request, res: Response, next) => {
		const jwt = req.headers.jwt;
		verifyUser(jwt, [
			ROLES.ADMIN,
			ROLES.MODERATOR,
			ROLES.TESTER,
			ROLES.USER,
		])
			.then((user) => {
				// Add user to res.locals so other routes can make use of it
				res.locals.user = user;
				if (!user.photoURL) res.locals.user.photoURL = "";
				next();
			})
			.catch((err) => {
				res.send(createAPIResponseString(err, 400));
			});
	});
	app.put("*", (req: Request, res: Response, next) => {
		const jwt = req.headers.jwt;
		verifyUser(jwt, [
			ROLES.ADMIN,
			ROLES.MODERATOR,
			ROLES.TESTER,
			ROLES.USER,
		])
			.then(() => {
				next();
			})
			.catch((err) => {
				res.send(createAPIResponseString(err, 400));
			});
	});
	app.delete("*", (req: Request, res: Response, next) => {
		const jwt = req.headers.jwt;
		verifyUser(jwt, [
			ROLES.ADMIN,
			ROLES.MODERATOR,
			ROLES.TESTER,
			ROLES.USER,
		])
			.then(() => {
				next();
			})
			.catch((err) => {
				res.send(createAPIResponseString(err, 400));
			});
	});
	setupUserRoutes(app);
};

export const setupUserRoutes = (app: Application): void => {
	app.get("/me", (req: Request, res: Response) => {
		const jwt = req.headers.jwt;
		verifyUser(jwt, [
			ROLES.ADMIN,
			ROLES.MODERATOR,
			ROLES.TESTER,
			ROLES.USER,
		])
			.then((user: User) => {
				res.cookie("jwt", jwt);
				res.send(createAPIResponseString(user, 200));
			})
			.catch((err) => {
				res.send(createAPIResponseString(err, 400));
			});
	});
};
