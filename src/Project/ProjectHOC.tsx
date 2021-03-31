import React from "react";
import { APIResponse } from "../../Models/ApiResponse";
import { Project } from "../../Models/Project";
import { API_PATHS } from "../Api";
import ProjectList from "./List";
import { appContext } from "../AppContext";

export const BasicProjectList: React.FC = () => {
	const context = React.useContext(appContext);
	const [projectList, setProjectList] = React.useState<Project[]>(() => []);
	React.useEffect(() => {
		context.api
			.get(API_PATHS.PROJECT, "/all")
			.then((result: APIResponse) => {
				if (result.status >= 200 && result.status <= 299) {
					setProjectList(result.data as Project[]);
				}
			});
	}, []);

	return <ProjectList projects={projectList} />;
};

export const FeaturedProjectList: React.FC = () => {
	const context = React.useContext(appContext);
	const [projectList, setProjectList] = React.useState<Project[]>(() => []);
	React.useEffect(() => {
		context.api
			.get(API_PATHS.PROJECT, "/featured")
			.then((result: APIResponse) => {
				if (result.status >= 200 && result.status <= 299) {
					setProjectList(result.data as Project[]);
				}
			});
	}, []);

	return <ProjectList projects={projectList} />;
};
