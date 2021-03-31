import * as express from "express";
import { v4 as uuidv4 } from "uuid";
import { createAPIResponseString } from "../Models/ApiResponse";
import { ProjectFlag } from "../Models/ProjectFlag";
import { readProject, updateProject } from "./project";

const flagProject = async (
	id: string,
	projectFlag: ProjectFlag
): Promise<void> => {
	projectFlag.id = uuidv4();
	projectFlag.dateRequested = new Date();
	const project = await readProject(id);
	if (!project.flags) {
		project.flags = [];
	}
	project.flags.push(projectFlag);
	await updateProject(project);
};

export const setupProjectFlaggingRoutes = (app: express.Application): void => {
	app.post(
		"/project/:id/flag",
		(req: express.Request, res: express.Response) => {
			const id = req.params.id;
			const projectFlag = req.body as ProjectFlag;
			flagProject(id, projectFlag)
				.then(() => res.send(createAPIResponseString(true, 200)))
				.catch(() =>
					res.send(
						createAPIResponseString(
							"Failed to create project flag",
							500
						)
					)
				);
		}
	);
};
