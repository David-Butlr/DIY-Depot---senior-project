import * as React from "react";
import {
	Button,
	DialogActions,
	DialogContent,
	FormControl,
	Grid,
	InputLabel,
	Select,
	TextField,
} from "@material-ui/core";
import {
	ProjectFlag,
	projectFlagRequestTypeFromString,
	PROJECT_FLAG_REQUEST,
	PROJECT_FLAG_STATE,
} from "../../Models/ProjectFlag";
type FlaggingModalProps = {
	submitFlag: (projectFlag: ProjectFlag) => Promise<void>;
	onClose: () => void;
};

const FlaggingModal: React.FC<FlaggingModalProps> = ({
	submitFlag,
	onClose,
}: FlaggingModalProps) => {
	const [projectFlag, setProjectFlag] = React.useState<ProjectFlag>({
		id: "",
		userId: "",
		dateRequested: new Date(),
		state: PROJECT_FLAG_STATE.PENDING,
		request: PROJECT_FLAG_REQUEST.INCORRECT_DIFFICULTY,
		additionalInformation: "",
	});
	const setFlagRequestType = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setProjectFlag({
			...projectFlag,
			request: projectFlagRequestTypeFromString(e.target.value),
		});
	};
	return (
		<React.Fragment>
			<DialogContent>
				<Grid container spacing={2} direction="column">
					<Grid item>
						<FormControl variant="outlined">
							<InputLabel htmlFor="request-type">
								Request Type
							</InputLabel>
							<Select
								native
								value={projectFlag.request}
								onChange={setFlagRequestType}
								inputProps={{
									name: "request-type",
									id: "request-type",
								}}
							>
								<option value={PROJECT_FLAG_REQUEST.ABUSIVE}>
									Abusive
								</option>
								<option value={PROJECT_FLAG_REQUEST.COPYRIGHT}>
									Copyright Issue
								</option>
								<option value={PROJECT_FLAG_REQUEST.FAKE}>
									Fake Project
								</option>
								<option value={PROJECT_FLAG_REQUEST.HAZARDOUS}>
									Hazardous
								</option>
								<option value={PROJECT_FLAG_REQUEST.ILLEGAL}>
									Illegal
								</option>
								<option
									value={
										PROJECT_FLAG_REQUEST.INCORRECT_DIFFICULTY
									}
								>
									Incorrect Difficulty
								</option>
								<option
									value={PROJECT_FLAG_REQUEST.MISINFORMATION}
								>
									Misinformation
								</option>
								<option
									value={PROJECT_FLAG_REQUEST.SEXUAL_CONTENT}
								>
									Sexual Content
								</option>
							</Select>
						</FormControl>
					</Grid>
					<Grid item>
						<TextField
							fullWidth
							variant="outlined"
							type="text"
							label="Additional Information"
							value={projectFlag.additionalInformation}
							rows={4}
							multiline
							onChange={(
								e: React.ChangeEvent<HTMLInputElement>
							) =>
								setProjectFlag({
									...projectFlag,
									additionalInformation: e.target.value,
								})
							}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Grid>
					<Button
						variant="contained"
						color="secondary"
						onClick={onClose}
					>
						Close
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={() => submitFlag(projectFlag)}
					>
						Submit
					</Button>
				</Grid>
			</DialogActions>
		</React.Fragment>
	);
};

export default FlaggingModal;
