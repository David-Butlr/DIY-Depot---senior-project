import * as React from "react";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	Grid,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@material-ui/core";
import { appContext } from "../AppContext";
import { API_PATHS } from "../Api";
import { User, getRolesArray, getUserRoleFromString } from "../../Models/User";

const AdminUsers: React.FC = () => {
	const context = React.useContext(appContext);
	const [searchText, setSearchText] = React.useState("");
	const [userList, setUserList] = React.useState<User[]>();

	const getUsers = () => {
		context.api
			.get(API_PATHS.ADMIN, `/user?searchText=${encodeURI(searchText)}`)
			.then((result) => {
				if (result.status >= 200 && result.status <= 299) {
					const list: User[] = result.data as User[];
					setUserList(list);
				} else {
					context.openError(result.data as string);
				}
			})
			.catch(() => context.openError("Failed to get users try again"));
	};

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchText(value);
	};

	const updateRole = async (role: string, user: User) => {
		try {
			const userUpdate = { ...user };
			userUpdate.role = getUserRoleFromString(role);
			let result = await context.api.put(
				API_PATHS.ADMIN,
				`/user/${user.id}`,
				userUpdate
			);
			if (result.status >= 200 && result.status <= 299) {
				context.openError("Role changed");
				await getUsers();
			} else {
				context.openError(result.data as string);
			}
		} catch (err) {
			context.openError("Failed to change role");
		}
	};

	return (
		<Grid container spacing={2} direction="column">
			<Grid item>
				<Typography variant="h3">Search for user</Typography>
			</Grid>
			<Grid item>
				<TextField
					label="Search Field"
					variant="outlined"
					onChange={handleChange}
				></TextField>
				<Button variant="contained" onClick={getUsers}>
					Search
				</Button>
			</Grid>
			{userList &&
				userList.map((user: User) => (
					<Grid item key={user.id}>
						<Card>
							<CardContent>
								<CardHeader
									title={user.name}
									subheader={user.email}
								/>
								<Typography variant="body2" component="p">
									{user.id}
								</Typography>
								<Select
									labelId="demo-simple-select-helper-label"
									id={user.id}
									value={user.role}
									onChange={(
										e: React.ChangeEvent<HTMLInputElement>
									) => updateRole(e.target.value, user)}
								>
									{getRolesArray().map((role) => (
										<MenuItem value={role} key={role}>
											{role}
										</MenuItem>
									))}
								</Select>
							</CardContent>
						</Card>
					</Grid>
				))}
		</Grid>
	);
};

export default AdminUsers;
