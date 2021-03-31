import * as React from "react";
import firebase from "firebase/app";
import Cookies from "universal-cookie";
import {
	createBlankUser,
	DbUser,
	ROLES,
	User,
	userFromDbUser,
} from "../Models/User";
import { ModalProps } from "./Components/Modal";
import API from "./Api";

type FBDocData = firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;

export type AppContext = {
	firebaseAuth: firebase.auth.Auth | null;
	firebaseUser: firebase.User | null;
	diyDepotUser: User;
	api: API;
	cookies: Cookies;
	openError: (err: string) => void;
	openModal: (modalConfig: ModalProps | null) => void;
	closeModal: () => void;
};

export const appContext = React.createContext<AppContext>({
	firebaseAuth: null,
	firebaseUser: null,
	diyDepotUser: createBlankUser(),
	api: new API(),
	cookies: new Cookies(),
	openError: () => {
		return;
	},
	openModal: () => {
		return;
	},
	closeModal: () => {
		return;
	},
});

export const onUserLoginChange = async (
	user: firebase.User | null,
	firebaseAuth: firebase.auth.Auth,
	setDiyDepotUser: (user: User) => void,
	openError: (error: string) => void
): Promise<void> => {
	// If the user just logged in
	if (user) {
		// See if we can find the user in our database
		const usersRef: FBDocData = firebase.firestore().collection("Users");
		const query = await usersRef.where("id", "==", user.uid).get();
		if (!query.empty) {
			// User exists in database
			const snapshot = query.docs[0];
			let user = userFromDbUser(snapshot.data() as DbUser, snapshot.id);
			setDiyDepotUser(user);
		} else {
			// Add user to database
			let dbUser: DbUser = {
				id: user.uid,
				email: user.email ?? "",
				name: firebaseAuth.currentUser?.displayName
					? firebaseAuth.currentUser.displayName
					: "",
				role: ROLES.USER,
				photoURL: user.photoURL ? user.photoURL : "",
				dateCreated: Date.now(),
			};
			try {
				const result = await usersRef.add(dbUser);
				setDiyDepotUser(userFromDbUser(dbUser, result.id));
			} catch (err) {
				openError("Failed to create user. Please try again");
			}
		}
	} else {
		setDiyDepotUser(createBlankUser());
	}
};
