import {
	Button,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	Radio,
	RadioGroup,
	TextField,
	Typography,
} from "@material-ui/core";
import * as React from "react";
import { AdminUrl, URL_TYPE } from "../../../Models/AdminUrl";
import { APIResponse } from "../../../Models/ApiResponse";
import { API_PATHS } from "../../Api";
import { appContext } from "../../AppContext";
type AdminUrlFormProps = {
	selectedAdminUrl: AdminUrl;
	isNew: boolean;
	goBack: () => void;
};

const AdminUrlForm: React.FC<AdminUrlFormProps> = ({
	selectedAdminUrl,
	isNew,
	goBack,
}: AdminUrlFormProps) => {
	const context = React.useContext(appContext);
	const [path, setPath] = React.useState(selectedAdminUrl.path);
	const [type, setType] = React.useState(selectedAdminUrl.type);
	const onSubmit = async () => {
		try {
			let result: APIResponse = { status: 500, data: null };
			if (isNew) {
				result = await context.api.post(API_PATHS.ADMIN, "/urls", {
					path,
					type,
					id: "",
				});
			} else {
				result = await context.api.put(
					API_PATHS.ADMIN,
					`/urls/${selectedAdminUrl.id}`,
					{ path, type, id: selectedAdminUrl.id }
				);
			}
			if (result.status >= 200 && result.status <= 299) {
				context.openError("Url Created");
				goBack();
			} else {
				context.openError(result.data as string);
			}
		} catch (err) {
			context.openError("Failed to create Url");
		}
	};
	const setPathFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPath(e.target.value);
	};
	const setTypeFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === URL_TYPE.BLACKLISTED.toString())
			setType(URL_TYPE.BLACKLISTED);
		else setType(URL_TYPE.WHITELISTED);
	};
	return (
		<Grid container spacing={2} direction="column">
			<Grid item>
				<Typography variant="h3">Admin Url Form</Typography>
				<Button variant="contained" onClick={goBack}>
					Back
				</Button>
			</Grid>
			<Grid item>
				<TextField
					label="Url Path"
					variant="outlined"
					fullWidth
					value={path}
					onChange={setPathFromInput}
				/>
			</Grid>
			<Grid item>
				<FormControl component="fieldset">
					<FormLabel component="legend">Url Type</FormLabel>
					<RadioGroup value={type} onChange={setTypeFromInput}>
						<FormControlLabel
							value={URL_TYPE.BLACKLISTED}
							control={<Radio />}
							label="Blacklisted"
						/>
						<FormControlLabel
							value={URL_TYPE.WHITELISTED}
							control={<Radio />}
							label="Whitelisted"
						/>
					</RadioGroup>
				</FormControl>
			</Grid>
			<Grid item>
				<Button variant="contained" onClick={onSubmit}>
					Submit
				</Button>
			</Grid>
		</Grid>
	);
};

export default AdminUrlForm;
