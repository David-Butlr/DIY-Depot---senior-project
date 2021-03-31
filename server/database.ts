import * as admin from "firebase-admin";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const database = admin.firestore();

export default database;

export const getProjectsTable = (): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> => {
	return database.collection("Projects");
};

export const getAdminUrlTable = (): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> => {
	return database.collection("AdminUrls");
};

export const getTagsTable = (): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> => {
	return database.collection("Tags");
};

export const getUserTable = (): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> => {
	return database.collection("Users");
};
