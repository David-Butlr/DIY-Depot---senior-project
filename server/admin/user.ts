import { Application, Request, Response } from "express";
import * as admin from "firebase-admin";
import {
	DbUser,
	User,
	userFromDbUser,
	userToDbUser,
	userFromAPIUser,
} from "../../Models/User";
import { getUserTable } from "../database";
import { createAPIResponseString } from "../../Models/ApiResponse";

export const setupAdminUserRoutes = (app: Application): void => {
	app.get("/admin/user", (req: Request, res: Response) => {
		const searchText = req.query.searchText as string;
		readUsers(searchText)
			.then((adminUrls) =>
				res.send(createAPIResponseString(adminUrls, 200))
			)
			.catch(() =>
				res.send(
					createAPIResponseString("Failed to retrieve users", 500)
				)
			);
	});

	app.put("/admin/user/:id", (req: Request, res: Response) => {
		const user = userFromAPIUser(req.body);
		if (req.params.id !== user.id) {
			res.send(
				createAPIResponseString("User id doesn't match request", 400)
			);
			return;
		}
		updateUser(user)
			.then(() => res.send(createAPIResponseString(true, 200)))
			.catch((err) => {
				console.error(err);
				res.send(createAPIResponseString("Failed to update user", 500));
			});
	});

	app.delete("/admin/user/:id", (req: Request, res: Response) => {
		const id = req.params.id;
		deleteUser(id)
			.then(() => res.send(createAPIResponseString(true, 200)))
			.catch(() =>
				res.send(createAPIResponseString("Failed to delete user", 500))
			);
	});
};

const readUsers = async (searchText: string): Promise<User[]> => {
	const users: User[] = [];
	const usersRef = getUserTable();
	const snapshot = await usersRef.get();
	searchText = searchText.toLowerCase();
	snapshot.forEach((doc) => {
		const user = userFromDbUser(doc.data() as DbUser, doc.id);
		if (
			user.email.toLowerCase().includes(searchText) ||
			user.id.toLowerCase().includes(searchText) ||
			user.name.toLowerCase().includes(searchText)
		) {
			users.push(user);
		}
	});
	return users;
};

const readUser = async (id: string): Promise<User> => {
	const usersRef = getUserTable();
	const snapshot = await usersRef.where("id", "==", id).get();
	if (snapshot.size > 1 || snapshot.size == 0) throw "Invalid id";
	const user = userFromDbUser(
		snapshot.docs[0].data() as DbUser,
		snapshot.docs[0].id
	);
	return user;
};

const updateUser = async (
	user: User
): Promise<FirebaseFirestore.WriteResult> => {
	return await getUserTable().doc(user.dbId).set(userToDbUser(user));
};

const deleteUser = async (
	dbId: string
): Promise<FirebaseFirestore.WriteResult> => {
	return await getUserTable().doc(dbId).delete();
};

export const getUserFromToken = async (jwt: string): Promise<User> => {
	const decodedId = await admin.auth().verifyIdToken(jwt);
	const accurateDate = Math.trunc(Date.now() / 1000);
	if (decodedId.exp < accurateDate) throw "Token Expired";
	return await readUser(decodedId.uid);
};
