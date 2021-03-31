import "core-js/stable";
import "regenerator-runtime/runtime";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Home from "./Home/Home";
import ProjectForm from "./Project/Form";
import Wrapper from "./Wrapper";
import AdminUrlList from "./Admin/AdminUrl/List";
import AdminTags from "./Admin/Tags";
import Login from "./Login/Login";
import { BasicProjectList, FeaturedProjectList } from "./Project/ProjectHOC";
import ProjectDisplay from "./Project/Display";
import AdminUsers from "./Admin/Users";

const bootstrapApp = (location: string) => {
	const documentMount = document.getElementById("app");
	switch (location) {
		case "HOME":
			{
				ReactDOM.render(
					<Wrapper fullWidth={false}>
						<Home />
					</Wrapper>,
					documentMount
				);
			}
			break;
		case "PROJECT_FORM":
			{
				ReactDOM.render(
					<Wrapper>
						<ProjectForm />
					</Wrapper>,
					documentMount
				);
			}
			break;
		case "PROJECTS":
			{
				ReactDOM.render(
					<Wrapper>
						<BasicProjectList />
					</Wrapper>,
					document.getElementById("app")
				);
			}
			break;
		case "ADMIN_URL":
			{
				ReactDOM.render(
					<Wrapper>
						<AdminUrlList />
					</Wrapper>,
					documentMount
				);
			}
			break;
		case "ADMIN_TAG":
			{
				ReactDOM.render(
					<Wrapper>
						<AdminTags />
					</Wrapper>,
					documentMount
				);
			}
			break;
		case "LOGIN":
			{
				ReactDOM.render(
					<Wrapper>
						<Login />
					</Wrapper>,
					document.getElementById("app")
				);
			}
			break;
		case "PROJECT_DISPLAY":
			{
				const paths = window.location.pathname.split("/");
				const projectId = paths[paths.length - 1];
				ReactDOM.render(
					<Wrapper>
						<ProjectDisplay projectId={projectId} />
					</Wrapper>,
					document.getElementById("app")
				);
			}
			break;
		case "PROJECTS_FEATURED":
			{
				ReactDOM.render(
					<Wrapper>
						<FeaturedProjectList />
					</Wrapper>,
					document.getElementById("app")
				);
			}
			break;
		case "ADMIN_USERS": {
			ReactDOM.render(
				<Wrapper>
					<AdminUsers />
				</Wrapper>,
				document.getElementById("app")
			);
		}
	}
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).bootstrapApp = bootstrapApp;
