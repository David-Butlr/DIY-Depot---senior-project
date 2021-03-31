import * as React from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { appContext } from "../AppContext";
import firebase from "firebase";

// This demonstrates that we can conditionally display part of the app based on whether or not
// the user is logged-in
const Login: React.FC = () => {
	const context = React.useContext(appContext);

	const onLogOut = async () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				// Sign-out successful.
			})
			.catch(() => {
				alert("There was an error logging out");
			});
	};

	// Present the user with the Google sign-in popup
	const onGoogle = async () => {
		if (!context.firebaseAuth) return;
		const provider = new firebase.auth.GoogleAuthProvider();
		context.firebaseAuth.signInWithPopup(provider);
	};

	return (
		<Grid container spacing={2} direction="column">
			<Grid item>
				<Typography variant="h3">
					{context.firebaseUser
						? "Welcome " + context.diyDepotUser.name
						: "Login page"}
				</Typography>
			</Grid>
			<Grid item>
				{context.firebaseUser ? (
					<Button variant="contained" onClick={onLogOut}>
						Log Out
					</Button>
				) : (
					<Button variant="contained" onClick={onGoogle}>
						Sign in with Google
					</Button>
				)}
			</Grid>
		</Grid>
	);
};

export default Login;
