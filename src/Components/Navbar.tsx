import { Grid } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import * as React from "react";
import { ROLES } from "../../Models/User";
import { appContext } from "../AppContext";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";

const Navbar: React.FC = () => {
	const context = React.useContext(appContext);
	const isLoggedIn = context.firebaseUser !== null;
	return (
		<AppBar position="static">
			<Toolbar>
				<Grid container spacing={2} direction="row" alignItems="center">
					<Grid item>
						<Button color="inherit" href="/">
							DIY Depot
						</Button>
					</Grid>
					<Grid item>
						<Button color="inherit" href="/projects">
							Projects
						</Button>
					</Grid>
					{isLoggedIn ? (
						<Grid item>
							<Button color="inherit" href="/projects-form">
								Create Project
							</Button>
						</Grid>
					) : null}

					{isLoggedIn && context.diyDepotUser.role === ROLES.ADMIN ? (
						<Grid item>
							<Button color="inherit" href="/admin">
								Admin
							</Button>
						</Grid>
					) : null}

					{/* Push the login/account button to the right */}
					<Grid item style={{ flex: 1 }}></Grid>
					<Grid item>
						{isLoggedIn ? (
							<Button color="inherit" href="/login">
								{context.diyDepotUser.name}
								<Box ml={1}>
									<Avatar
										alt={context.diyDepotUser.name}
										src={context.diyDepotUser.photoURL}
									/>
								</Box>
							</Button>
						) : (
							<Button color="inherit" href="/login">
								Login
							</Button>
						)}
					</Grid>
				</Grid>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
