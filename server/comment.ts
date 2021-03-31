import * as express from "express";
import { Comment } from "../Models/Comment";
import { v4 as uuidv4 } from "uuid";
import { createAPIResponseString } from "../Models/ApiResponse";
import { getProjectsTable } from "./database";
import { readProject } from "./project";
import { projectToDbProject } from "../Models/Project";
import { User } from "../Models/User";

const createComment = async (id: string, comment: Comment) => {
	comment.id = uuidv4();
	// get project
	const project = await readProject(id);
	// add the comment to the object
	if (!project.comments) {
		project.comments = [];
	}
	project.comments.push(comment);
	// set the project to the new list of values
	return await getProjectsTable().doc(id).set(projectToDbProject(project));
};

const deleteComment = async (id: string, commentId: string) => {
	// get project
	const project = await readProject(id);
	// // add the comment to the object
	project.comments = (project.comments || []).filter(
		(comment) => comment.id != commentId
	);
	// // set the project to the new list of values
	return await getProjectsTable().doc(id).set(projectToDbProject(project));
};

//Get all the comments by project id
export const getComments = async (id: string): Promise<Comment[]> => {
	const project = await readProject(id);
	return project.comments ?? [];
};

export const setupCommentRoutes = (app: express.Application): void => {
	app.post(
		"/project/:id/comment",
		(req: express.Request, res: express.Response) => {
			const id = req.params.id;
			const comment = req.body as Comment;
			if (comment.text.length === 0) {
				res.send(
					createAPIResponseString("Comment can not be empty", 500)
				);
			} else {
				comment.dateCreated = new Date();
				comment.dateUpdated = new Date();

				// Get user name, id, and photoURL (our middleware will have gotten this from the jwt)
				const user: User = res.locals.user;
				comment.userId = user.id;
				comment.userName = user.name;
				comment.userPhotoURL = user.photoURL;

				createComment(id, comment)
					.then(() => {
						res.send(createAPIResponseString(true, 200));
					})
					.catch(() => {
						res.send(
							createAPIResponseString(
								"Failed to create comment",
								500
							)
						);
					});
			}
		}
	);
	app.delete(
		"/project/:id/comment/:commentId",
		(req: express.Request, res: express.Response) => {
			const id = req.params.id;
			const commentId = req.params.commentId;

			deleteComment(id, commentId)
				.then(() => {
					res.send(createAPIResponseString(true, 200));
				})
				.catch(() => {
					res.send(
						createAPIResponseString("Failed to delete comment", 500)
					);
				});
		}
	);
	app.get(
		"/project/:id/comments",
		(req: express.Request, res: express.Response) => {
			const id = req.params.id;
			getComments(id)
				.then((comments) => {
					res.send(createAPIResponseString(comments, 200));
				})
				.catch(() => {
					res.send(
						createAPIResponseString("Failed to get comments", 500)
					);
				});
		}
	);
};
