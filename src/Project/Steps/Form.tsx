import * as React from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import {
	getProjectStepTypeString,
	ProjectStep,
	PROJECT_STEP_TYPE,
} from "../../../Models/ProjectStep";
import { appContext } from "../../AppContext";
import StepModal from "./Modal";

type ProjectStepFormProps = {
	steps: ProjectStep[];
	setSteps: (steps: ProjectStep[]) => void;
};

const ProjectStepForm: React.FC<ProjectStepFormProps> = ({
	steps,
	setSteps,
}: ProjectStepFormProps) => {
	const context = React.useContext(appContext);
	const createStep = () =>
		context.openModal({
			modalBody: (
				<StepModal
					addStep={addStep}
					onClose={context.closeModal}
					stepToEdit={{
						id: `${Date.now()}`,
						type: PROJECT_STEP_TYPE.TEXT,
						description: "",
						url: "",
					}}
				/>
			),
			open: true,
		});

	const editStep = (step: ProjectStep) =>
		context.openModal({
			modalBody: (
				<StepModal
					addStep={addStep}
					onClose={context.closeModal}
					stepToEdit={step}
				/>
			),
			open: true,
		});

	const addStep = (step: ProjectStep): boolean => {
		if (!step) return false;
		if (
			(step.type === PROJECT_STEP_TYPE.TEXT ||
				step.type === PROJECT_STEP_TYPE.PHOTO) &&
			step.description.length === 0
		) {
			context.openError("Your step must include text");
			return false;
		}
		if (
			(step.type === PROJECT_STEP_TYPE.PHOTO ||
				step.type === PROJECT_STEP_TYPE.VIDEO) &&
			step.url.length === 0
		) {
			context.openError("Your step must include a url");
			return false;
		}
		setSteps([...steps.filter((s) => s.id !== step.id), step]);
		return true;
	};

	return (
		<Grid container spacing={2} direction="column">
			<Grid item>
				<Button
					variant="contained"
					color="primary"
					onClick={createStep}
				>
					Add Step
				</Button>
			</Grid>
			{steps.map((s, index) => {
				return (
					<Grid item key={s.id}>
						<Typography>Step {index + 1}:</Typography>
						<Typography>
							Type {getProjectStepTypeString(s.type)}
						</Typography>
						<Button
							variant="contained"
							color="primary"
							onClick={() => editStep(s)}
						>
							Edit Step
						</Button>
					</Grid>
				);
			})}
		</Grid>
	);
};

export default ProjectStepForm;
