import { Application, Request, Response } from "express";
import Cookies from "universal-cookie";
import { createAPIResponseString } from "../../Models/ApiResponse";
import { ROLES } from "../../Models/User";
import { verifyUser } from "../user";
import { setupAdminUrlRoutes } from "./url";
import { setupTagRoutes } from "./tags";
import { setupAdminUserRoutes } from "./user";

export const setupAdminRoutes = (app: Application): void => {
	app.all("/admin*", (req: Request, res: Response, next) => {
		const cookies = new Cookies(req.headers.cookie);
		const jwt = cookies.get("jwt");
		verifyUser(jwt, [ROLES.ADMIN])
			.then(() => {
				next();
			})
			.catch((err) => {
				res.send(createAPIResponseString(err, 400));
			});
	});

	setupAdminUrlRoutes(app);
	setupTagRoutes(app);
	setupAdminUserRoutes(app);
};
