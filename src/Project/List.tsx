import * as React from "react";
import { Project } from "../../Models/Project";
import {
	Grid,
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableBody,
	TableCell,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { getDateString } from "../../Models/Utils";
import ProjectFilter from "./Filter";
import { Tag } from "../../Models/Tag";

type ProjectListProps = {
	projects: Project[];
};

const useStyles = makeStyles((theme) => ({
	small: {
		width: theme.spacing(3),
		height: theme.spacing(3),
	},
}));

const ProjectList: React.FC<ProjectListProps> = ({
	projects,
}: ProjectListProps) => {
	const classes = useStyles();
	const [displayedProjectList, setDisplayedProjectList] = React.useState<
		Project[]
	>(() => projects);
	const [selectedTags, setSelectedTags] = React.useState<Tag[]>(() => []);
	React.useEffect(() => {
		setDisplayedProjectList(
			projects.filter((project) => {
				if (selectedTags.length === 0) return true;
				for (let i = 0, { length } = selectedTags; i < length; i++) {
					if (project.tags.indexOf(selectedTags[i]) > -1) return true;
				}
				return false;
			})
		);
	}, [projects, selectedTags]);

	return (
		<Grid container spacing={2} direction="row">
			<Grid item xs={3}>
				<ProjectFilter
					selectedTags={selectedTags}
					setSelectedTags={setSelectedTags}
				/>
			</Grid>
			<Grid item xs>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Title</TableCell>
								<TableCell align="right">
									Date Created
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{displayedProjectList.map((project: Project) => (
								<TableRow
									key={project.id}
									onClick={() =>
										window.location.assign(
											`${window.location.origin}/projects/${project.id}`
										)
									}
									hover
									style={{ cursor: "pointer" }}
								>
									<TableCell component="th" scope="row">
										<Grid
											container
											direction="column"
											alignItems="flex-start"
										>
											<Grid item>
												<Box fontWeight="fontWeightBold">
													{project.title}
												</Box>
											</Grid>
											<Grid
												container
												direction="row"
												alignItems="center"
											>
												&nbsp;&nbsp;by&nbsp;
												<Avatar
													className={classes.small}
													alt={project.authorName}
													src={project.authorPhotoURL}
												/>
												&nbsp;{project.authorName}
											</Grid>
										</Grid>
									</TableCell>
									<TableCell align="right">
										{getDateString(project.dateCreated)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</Grid>
	);
};

export default ProjectList;
