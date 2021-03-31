import * as express from "express";
import { v4 as uuidv4 } from "uuid";
import { createAPIResponseString } from "../Models/ApiResponse";
import {
	DbProject,
	isValidProject,
	Project,
	projectFromDbProject,
	projectToDbProject,
	PROJECT_TYPE,
} from "../Models/Project";
import { User } from "../Models/User";
import { getProjectsTable } from "./database";
import { setupProjectFlaggingRoutes } from "./projectFlagging";

const createProject = async (project: Project) => {
	project.id = uuidv4();
	return await getProjectsTable()
		.doc(project.id)
		.set(projectToDbProject(project));
};

//Using project ID to get stuff from the database.
export const readProject = async (id: string): Promise<Project> => {
	const projectRef = getProjectsTable().doc(id);
	const doc = await projectRef.get();
	if (!doc.exists) {
		throw "No such document!";
	}
	return projectFromDbProject(doc.data() as DbProject);
};

const readAllProjects = async (): Promise<Project[]> => {
	const projects: Project[] = [];
	const projectsRef = getProjectsTable();
	const snapshot = await projectsRef.get();
	snapshot.forEach((doc) => {
		projects.push(projectFromDbProject(doc.data() as DbProject));
	});
	return projects;
};

export const updateProject = async (
	project: Project
): Promise<FirebaseFirestore.WriteResult> => {
	return await getProjectsTable()
		.doc(project.id)
		.set(projectToDbProject(project));
};

export const setupProjectRoutes = (app: express.Application): void => {
	app.get(
		"/project/featured",
		(_: express.Request, res: express.Response) => {
			readAllProjects()
				.then((projects: Project[]) => {
					const featuredProjects = projects.filter((project) => {
						return project.type === PROJECT_TYPE.EXPO;
					});
					res.send(createAPIResponseString(featuredProjects, 200));
				})
				.catch((err) => {
					console.log(err);
					res.send(
						createAPIResponseString("Failed to get projects", 500)
					);
				});
		}
	);

	app.get("/project/all", (_: express.Request, res: express.Response) => {
		readAllProjects()
			.then((projects: Project[]) => {
				res.send(createAPIResponseString(projects, 200));
			})
			.catch((err) => {
				console.log(err);
				res.send(
					createAPIResponseString("Failed to get projects", 500)
				);
			});
	});

	app.get("/project/:id", (req: express.Request, res: express.Response) => {
		const projectId = req.params.id;
		readProject(projectId)
			.then((project: Project) => {
				res.send(createAPIResponseString(project, 200));
			})
			.catch((err) => {
				console.log(err);
				res.send(createAPIResponseString("Failed to get project", 500));
			});
	});

	app.post("/project", (req: express.Request, res: express.Response) => {
		const project = req.body as Project;
		try {
			if (isValidProject(project)) {
				project.dateCreated = new Date();
				project.dateUpdated = new Date();

				// Get user name, id, and photoURL (our middleware will have gotten this from the jwt)
				const user: User = res.locals.user;
				project.userId = user.id;
				project.authorName = user.name;
				project.authorPhotoURL = user.photoURL;
				createProject(project)
					.then(() => {
						res.send(createAPIResponseString(true, 200));
					})
					.catch(() => {
						res.send(
							createAPIResponseString(
								"Failed to create project",
								500
							)
						);
					});
			}
		} catch (err) {
			res.send(createAPIResponseString(err, 500));
		}
	});

	setupProjectFlaggingRoutes(app);
};
