import * as React from "react";
import { Project } from "../../Models/Project";
import { API_PATHS } from "../Api";
import { appContext } from "../AppContext";
import ReportIcon from "@material-ui/icons/Report";
import {
	Grid,
	Typography as MaterialTypography,
	Tooltip,
	Card,
	CardContent,
	Avatar,
} from "@material-ui/core";
import FlaggingModal from "./FlaggingModal";
import { ProjectFlag } from "../../Models/ProjectFlag";
import CommentSection from "./Comments/Section";
import ProjectSteps from "./Steps/List";
import Typography from "../Components/ATagAwareTypography";
import ResourceList from "./ResourceList";
import TagList from "./TagList";

type ProjectDisplayProps = {
	projectId: string;
};

const ShowFlag: React.FC<{ project: Project }> = ({
	project,
}: {
	project: Project;
}) => {
	const context = React.useContext(appContext);
	const [flagged, setFlagged] = React.useState(
		() => project.flags.length > 0
	);
	const projectId = project.id;
	const openContentFlaggingModal = () => {
		context.openModal({
			title: "Flag Content",
			modalBody: (
				<FlaggingModal
					submitFlag={submitFlag}
					onClose={context.closeModal}
				/>
			),
			open: true,
		});
	};
	const submitFlag = async (projectFlag: ProjectFlag): Promise<void> => {
		const result = await context.api.post(
			API_PATHS.PROJECT,
			`/${projectId}/flag`,
			projectFlag
		);
		if (result.status >= 200 && result.status <= 299) {
			context.closeModal();
			context.openError("Submitted Flag");
			setFlagged(true);
		} else {
			context.openError("Submission failed. Try again");
		}
	};
	return (
		<Tooltip title="Flag Project">
			{flagged ? (
				<Card
					style={{
						backgroundColor: "#F0FFA0",
						display: "inline-block",
						padding: "0",
						margin: "1em",
						cursor: "pointer",
					}}
					onClick={openContentFlaggingModal}
				>
					<CardContent style={{ margin: "0", padding: "0.5em" }}>
						<Grid container direction="row" alignItems="center">
							<ReportIcon />
							&ensp;Flagged
						</Grid>
					</CardContent>
				</Card>
			) : (
				<ReportIcon
					style={{ cursor: "pointer" }}
					onClick={openContentFlaggingModal}
				/>
			)}
		</Tooltip>
	);
};

const ProjectDisplay: React.FC<ProjectDisplayProps> = ({
	projectId,
}: ProjectDisplayProps) => {
	const [project, setProject] = React.useState<Project | null>(null);
	const context = React.useContext(appContext);

	React.useEffect(() => {
		context.api
			.get(API_PATHS.PROJECT, `/${projectId}`)
			.then((result) => {
				if (result.status >= 200 && result.status <= 299) {
					setProject(result.data as Project);
				} else {
					context.openError(
						"Failed to get project please reload the page"
					);
				}
			})
			.catch(() => {
				context.openError(
					"Failed to get project please reload the page"
				);
			});
	}, [projectId]);

	if (!project) return null;

	return (
		<Grid container spacing={2} direction="column">
			<Grid item>
				<MaterialTypography variant="h1">
					{project.title}
				</MaterialTypography>
				<MaterialTypography variant="h4">
					<Grid container direction="row" alignItems="center">
						&emsp;by&nbsp;
						<Avatar
							alt={project.authorName}
							src={project.authorPhotoURL}
						/>
						&nbsp;{project.authorName}
					</Grid>
				</MaterialTypography>
				<ShowFlag project={project} />
			</Grid>
			<Grid item>
				<MaterialTypography>
					By: <a>{project.userId}</a>
				</MaterialTypography>
			</Grid>
			<Grid item>
				<Typography text={project.description} />
			</Grid>
			<Grid item>
				Completed Photo: <br />
				<img src={project.completedPhotoUrl} width={200} height={200} />
			</Grid>
			<Grid item>
				<TagList listHeader="Tags" tags={project.tags} />
			</Grid>
			<Grid item>
				<ResourceList resources={project.resources} />
			</Grid>
			<Grid item>
				<ProjectSteps steps={project.steps} />
			</Grid>
			<Grid item>
				<CommentSection projectId={projectId} />
			</Grid>
		</Grid>
	);
};

export default ProjectDisplay;
