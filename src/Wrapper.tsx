import * as React from "react";
import Container from "@material-ui/core/Container";
import { useAuthState } from "react-firebase-hooks/auth";
import Cookies from "universal-cookie";
import firebase from "firebase/app";
import ErrorDisplay from "./Components/Error";
import Navbar from "./Components/Navbar";
import Modal from "./Components/Modal";
import { CssBaseline } from "@material-ui/core";
import { appContext, onUserLoginChange, AppContext } from "./AppContext";
import { User, createBlankUser } from "../Models/User";
import { ModalProps } from "./Components/Modal";
import API, { API_PATHS } from "./Api";

type WrapperProps = {
	showNavbar?: boolean;
	fullWidth?: boolean;
	children?: React.ReactNode;
};

const Wrapper: React.FC<WrapperProps> = ({
	showNavbar = true,
	fullWidth = true,
	children,
}: WrapperProps) => {
	const [error, setError] = React.useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
	const [modalConfig, setModalConfig] = React.useState<ModalProps | null>(
		null
	);

	// Initialize firebase if it hasn't been initialized
	if (!firebase.apps.length) {
		firebase.initializeApp({
			apiKey: "AIzaSyAiZY1oC1Q0yIIbAlie8RpaHf9sZYXmXBE",
			authDomain: "diy-depot-23b7e.firebaseapp.com",
			projectId: "diy-depot-23b7e",
			storageBucket: "diy-depot-23b7e.appspot.com",
			messagingSenderId: "24407921444",
			appId: "1:24407921444:web:9f7ed55cda4cc7489999b1",
			measurementId: "G-XG0PWXGN1S",
		});
	}

	const [firebaseAuth] = React.useState(firebase.auth());
	const [firebaseUser] = useAuthState(firebaseAuth);
	const [api] = React.useState(() => new API());
	const [cookies] = React.useState(() => new Cookies());
	const [diyDepotUser, setDiyDepotUser] = React.useState<User>(
		createBlankUser()
	);

	// Called when the user logs in or logs out

	// Register a callback for when the auth state changes
	// Putting the callback in useEffect and unsubscribing from it keeps it from being called multiple times
	// Code adapted from https://benmcmahen.com/using-firebase-with-react-hooks/
	React.useEffect(() => {
		// listen for auth state changes
		const unsubscribe = firebaseAuth.onAuthStateChanged(
			async (user: firebase.User) =>
				await onUserLoginChange(
					user,
					firebaseAuth,
					setDiyDepotUser,
					context.openError
				)
		);

		const unsubscribeToIdOnChange = firebaseAuth.onIdTokenChanged(
			(user) => {
				if (user) {
					user.getIdToken().then((token: string) => {
						api.setAuthToken(token);
					});
				} else {
					api.setAuthToken("");
					cookies.remove("diy_user");
				}
			}
		);

		// unsubscribe to the listener when unmounting
		return () => {
			unsubscribeToIdOnChange();
			unsubscribe();
		};
	}, []);

	React.useEffect(() => {
		const user = cookies.get("diy_user");
		if (user) {
			setDiyDepotUser(user);
		} else {
			context.api.get(API_PATHS.BASE, "me").then((result) => {
				const apiUserResult: User = result.data as User;
				if (
					typeof result.data !== "string" &&
					apiUserResult.id !== ""
				) {
					cookies.set("diy_user", JSON.stringify(apiUserResult), {
						expires: new Date(Date.now() + 86400),
						secure: true,
						sameSite: "strict",
					});
					setDiyDepotUser(apiUserResult);
				}
			});
		}
	}, [firebaseUser]);

	const context: AppContext = React.useMemo(() => {
		return {
			firebaseAuth,
			firebaseUser: firebaseUser || null,
			diyDepotUser,
			api,
			cookies,
			openError: setError,
			openModal: (modalConfig: ModalProps) => {
				setIsModalOpen(true);
				setModalConfig(modalConfig);
			},
			closeModal: () => {
				setIsModalOpen(false);
				setModalConfig(null);
			},
		};
	}, [
		diyDepotUser,
		firebaseAuth,
		firebaseUser,
		setError,
		setModalConfig,
		setIsModalOpen,
	]);
	return (
		<appContext.Provider value={context}>
			<CssBaseline />
			{showNavbar ? <Navbar /> : null}
			<Container
				maxWidth={fullWidth ? "xl" : "sm"}
				style={{ marginTop: "20px" }}
			>
				{children}
				{error ? (
					<ErrorDisplay
						message={error}
						onClose={() => setError(null)}
					/>
				) : null}
				<Modal
					{...modalConfig}
					open={isModalOpen}
					onClose={() => setIsModalOpen(false)}
				/>
			</Container>
		</appContext.Provider>
	);
};

export default Wrapper;
