import * as React from "react";
import {
	createBlankProject,
	Project,
	PROJECT_TYPE,
} from "../../Models/Project";
import ProjectStepForm from "./Steps/Form";
import { ProjectStep } from "../../Models/ProjectStep";
import { Tag } from "../../Models/Tag";
import { APIResponse } from "../../Models/ApiResponse";
import { appContext } from "../AppContext";
import { API_PATHS } from "../Api";
import {
	Button,
	FormControlLabel,
	FormLabel,
	Grid,
	Radio,
	RadioGroup,
	TextField,
	ListItemIcon,
	IconButton,
} from "@material-ui/core";
import { Delete, Add } from "@material-ui/icons";
import ResourceList from "./ResourceList";
import TagList from "./TagList";

type ProjectFormProps = {
	project?: Project;
};

const ProjectForm: React.FC<ProjectFormProps> = ({
	project,
}: ProjectFormProps) => {
	const context = React.useContext(appContext);
	const [projectForm, setProjectForm] = React.useState(
		project ?? createBlankProject(context.diyDepotUser.id)
	);
	const [resource, setResource] = React.useState(() => "");
	const [tags, setTags] = React.useState<Tag[]>(() => []);

	const getAllTags = () =>
		context.api.get(API_PATHS.TAGS, "/all").then((result: APIResponse) => {
			if (result.status >= 200 && result.status <= 299) {
				setTags(result.data as Tag[]);
			} else {
				context.openError(result.data as string);
			}
		});
	React.useEffect(() => {
		getAllTags();
	}, []);
	const addResource = () => {
		setProjectForm({
			...projectForm,
			resources: [...projectForm.resources, resource],
		});
		setResource("");
	};
	const removeResource = (index: number) => {
		setProjectForm({
			...projectForm,
			resources: projectForm.resources.filter((_, i) => i !== index),
		});
	};

	const submit = async () => {
		try {
			const result = await context.api.post(
				API_PATHS.PROJECT,
				"",
				projectForm
			);
			if (result.status >= 200 && result.status <= 299) {
				window.location.assign(`${window.location.origin}/projects`);
			} else {
				context.openError("Failed to create project");
			}
		} catch (err) {
			context.openError("Failed to create project");
		}
	};
	return (
		<Grid container spacing={2} direction="column">
			<Grid item>
				<TextField
					fullWidth
					variant="outlined"
					type="text"
					label="Title"
					placeholder="Awesome Light Blade V1"
					value={projectForm.title}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setProjectForm({
							...projectForm,
							title: e.target.value,
						})
					}
				/>
			</Grid>
			<Grid item>
				<TextField
					fullWidth
					variant="outlined"
					type="text"
					label="Description"
					placeholder="This is my awesome lightblade! It bends light. So cool!"
					value={projectForm.description}
					rows={4}
					multiline
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setProjectForm({
							...projectForm,
							description: e.target.value,
						})
					}
				/>
			</Grid>
			<Grid item>
				<TextField
					fullWidth
					variant="outlined"
					type="text"
					label="Completed Photo"
					placeholder="https://website.com/lightblade.png"
					value={projectForm.completedPhotoUrl}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setProjectForm({
							...projectForm,
							completedPhotoUrl: e.target.value,
						})
					}
				/>
			</Grid>
			<Grid item>
				<img
					alt="Completed Photo"
					src={projectForm.completedPhotoUrl}
					width={200}
					height={200}
				/>
			</Grid>
			<Grid item>
				<TextField
					fullWidth
					variant="outlined"
					type="text"
					label="Material"
					placeholder="(e.g. Raspberry Pi, wire, LED, ...)"
					value={resource}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setResource(e.target.value)
					}
				/>
			</Grid>
			<Grid item>
				<Button
					variant="contained"
					color="primary"
					onClick={addResource}
				>
					Add
				</Button>
			</Grid>
			<Grid item>
				<ResourceList
					resources={projectForm.resources}
					onDelete={removeResource}
				/>
			</Grid>
			<Grid item>
				<Grid container spacing={2} direction="row">
					<Grid item>
						<TagList
							listHeader="Available Tags"
							tags={tags.filter(
								(tag) => projectForm.tags.indexOf(tag) === -1
							)}
							actionComponent={(tag) => (
								<ListItemIcon>
									<IconButton
										edge="end"
										aria-label="delete"
										onClick={() =>
											setProjectForm({
												...projectForm,
												tags: [
													...projectForm.tags,
													tag,
												],
											})
										}
									>
										<Add fontSize="small" />
									</IconButton>
								</ListItemIcon>
							)}
						/>
					</Grid>
					<Grid item>
						<TagList
							listHeader="Selected Tags"
							tags={projectForm.tags}
							actionComponent={(tag) => (
								<ListItemIcon>
									<IconButton
										edge="end"
										aria-label="delete"
										onClick={() =>
											setProjectForm({
												...projectForm,
												tags: projectForm.tags.filter(
													(t) => t.id !== tag.id
												),
											})
										}
									>
										<Delete fontSize="small" />
									</IconButton>
								</ListItemIcon>
							)}
						/>
					</Grid>
				</Grid>

				{/* TODO In issue: https://git-community.cs.odu.edu/silver/diy-depot/-/issues/17 */}
			</Grid>
			<Grid item>
				<FormLabel component="legend">Type</FormLabel>
				<RadioGroup
					aria-label="type"
					name="type"
					value={projectForm.type}
					onChange={(e) =>
						setProjectForm({
							...projectForm,
							type:
								e.target.value === `${PROJECT_TYPE.TUTORIAL}`
									? PROJECT_TYPE.TUTORIAL
									: PROJECT_TYPE.EXPO,
						})
					}
				>
					<FormControlLabel
						value={PROJECT_TYPE.TUTORIAL}
						control={<Radio />}
						label="Tutorial"
					/>
					<FormControlLabel
						value={PROJECT_TYPE.EXPO}
						control={<Radio />}
						label="Expo"
					/>
				</RadioGroup>
			</Grid>
			{projectForm.type === PROJECT_TYPE.TUTORIAL ? (
				<Grid item>
					<ProjectStepForm
						steps={projectForm.steps}
						setSteps={(steps: ProjectStep[]) =>
							setProjectForm({ ...projectForm, steps })
						}
					/>
				</Grid>
			) : null}
			<Grid item>
				<Button variant="contained" color="primary" onClick={submit}>
					Submit
				</Button>
			</Grid>
		</Grid>
	);
};

export default ProjectForm;
