import {
	Grid,
	Typography,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@material-ui/core";
import * as React from "react";
import { API_PATHS } from "../../Api";
import { APIResponse } from "../../../Models/ApiResponse";
import { AdminUrl, URL_TYPE } from "../../../Models/AdminUrl";
import { appContext } from "../../AppContext";
import AdminUrlForm from "./Form";

const AdminUrlList: React.FC = () => {
	const [adminUrlList, setAdminUrlList] = React.useState<AdminUrl[]>([]);
	const [
		selectedAdminUrl,
		setSelectedAdminUrl,
	] = React.useState<AdminUrl | null>(null);
	const context = React.useContext(appContext);
	React.useEffect(() => {
		getAllUrls();
	}, []);

	const getAllUrls = () =>
		context.api
			.get(API_PATHS.ADMIN, "/urls/all")
			.then((result: APIResponse) => {
				if (result.status >= 200 && result.status <= 299) {
					setAdminUrlList(result.data as AdminUrl[]);
				} else {
					context.openError(result.data as string);
				}
			});

	const addUrl = () => {
		setSelectedAdminUrl({
			id: "",
			path: "",
			type: URL_TYPE.BLACKLISTED,
		});
	};

	const editUrl = (adminUrl: AdminUrl) => {
		setSelectedAdminUrl(adminUrl);
	};

	const deleteUrl = (id: string) => {
		context.api
			.delete(API_PATHS.ADMIN, `/urls/${id}`)
			.then((result: APIResponse) => {
				if (result.status >= 200 && result.status <= 299) {
					context.openError(
						"Successfully deleted admin url" as string
					);
					getAllUrls();
				} else {
					context.openError(result.data as string);
				}
			});
	};

	const goBack = () => {
		setSelectedAdminUrl(null);
		getAllUrls();
	};

	if (selectedAdminUrl != null) {
		return (
			<AdminUrlForm
				selectedAdminUrl={selectedAdminUrl}
				isNew={selectedAdminUrl.id === ""}
				goBack={goBack}
			/>
		);
	}

	return (
		<Grid>
			<Grid item>
				<Typography>Admin Url</Typography>
			</Grid>
			<Grid item>
				<Button variant="contained" color="primary" onClick={addUrl}>
					Add Url
				</Button>
			</Grid>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell> Url Path </TableCell>
							<TableCell align="right">
								Whitelisted/Blacklisted
							</TableCell>
							<TableCell align="right"> Edit Url </TableCell>
							<TableCell align="right"> Delete Url </TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{adminUrlList.map((adminUrl: AdminUrl) => (
							<TableRow key={adminUrl.id}>
								<TableCell component="th" scope="row">
									<a
										href={adminUrl.path}
										target="_blank"
										rel="noopener noreferrer"
									>
										{adminUrl.path}
									</a>
								</TableCell>
								<TableCell align="right">
									{adminUrl.type === URL_TYPE.WHITELISTED
										? "Whitelisted"
										: "Blacklisted"}
								</TableCell>
								<TableCell align="right">
									<Button
										variant="contained"
										color="primary"
										onClick={() => editUrl(adminUrl)}
									>
										Edit
									</Button>
								</TableCell>
								<TableCell align="right">
									<Button
										variant="contained"
										color="primary"
										onClick={() => deleteUrl(adminUrl.id)}
									>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Grid>
	);
};

export default AdminUrlList;
