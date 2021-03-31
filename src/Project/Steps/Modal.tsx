import * as React from "react";
import {
	Button,
	DialogActions,
	DialogContent,
	FormControlLabel,
	FormLabel,
	Grid,
	Radio,
	RadioGroup,
	TextField,
} from "@material-ui/core";
import {
	getProjectStepTypeFromString,
	ProjectStep,
	PROJECT_STEP_TYPE,
} from "../../../Models/ProjectStep";
type StepModalProps = {
	stepToEdit: ProjectStep;
	addStep: (step: ProjectStep) => boolean;
	onClose: () => void;
};

const StepModal: React.FC<StepModalProps> = ({
	stepToEdit,
	addStep,
	onClose,
}: StepModalProps) => {
	const [step, setStep] = React.useState<ProjectStep>(stepToEdit);
	const setType = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStep({
			...step,
			type: getProjectStepTypeFromString(e.target.value),
		});
	};
	return (
		<React.Fragment>
			<DialogContent>
				<Grid container spacing={2} direction="column">
					<Grid item>
						<FormLabel component="legend">Type</FormLabel>
						<RadioGroup
							aria-label="type"
							name="type"
							value={step.type}
							onChange={setType}
						>
							<FormControlLabel
								value={PROJECT_STEP_TYPE.TEXT}
								control={<Radio />}
								label="Text"
							/>
							<FormControlLabel
								value={PROJECT_STEP_TYPE.PHOTO}
								control={<Radio />}
								label="Photo"
							/>
							<FormControlLabel
								value={PROJECT_STEP_TYPE.VIDEO}
								control={<Radio />}
								label="Video"
							/>
						</RadioGroup>
					</Grid>
					<Grid item>
						<TextField
							fullWidth
							label="Description"
							variant="outlined"
							type="text"
							value={step.description}
							onChange={(e) =>
								setStep({
									...step,
									description: e.target.value,
								})
							}
						/>
					</Grid>
					{step.type === PROJECT_STEP_TYPE.PHOTO ||
					step.type === PROJECT_STEP_TYPE.VIDEO ? (
						<Grid item>
							<TextField
								fullWidth
								label="Url"
								variant="outlined"
								type="text"
								value={step.url}
								onChange={(e) =>
									setStep({ ...step, url: e.target.value })
								}
							/>
						</Grid>
					) : null}
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
						onClick={() => {
							if (addStep(step)) onClose();
						}}
					>
						Save
					</Button>
				</Grid>
			</DialogActions>
		</React.Fragment>
	);
};

export default StepModal;
