import * as React from "react";
import { Grid, Typography as MaterialTypography } from "@material-ui/core";
import { ProjectStep, PROJECT_STEP_TYPE } from "../../../Models/ProjectStep";
import Typography from "../../Components/ATagAwareTypography";

type ProjectStepsProps = {
	steps: ProjectStep[];
};

const ProjectSteps: React.FC<ProjectStepsProps> = ({
	steps,
}: ProjectStepsProps) => {
	return (
		<Grid container spacing={2} direction="column">
			{steps.map((step, i) => {
				return (
					<Grid item key={step.id}>
						<MaterialTypography variant="h5">
							Step {i + 1}:
						</MaterialTypography>
						<Typography text={step.description} />
						{step.type === PROJECT_STEP_TYPE.PHOTO ? (
							<img src={step.url} width={200} height={200} />
						) : null}
						{step.type === PROJECT_STEP_TYPE.VIDEO ? (
							<video
								width="320"
								height="240"
								src={step.url}
								controls
							/>
						) : null}
					</Grid>
				);
			})}
		</Grid>
	);
};

export default ProjectSteps;
