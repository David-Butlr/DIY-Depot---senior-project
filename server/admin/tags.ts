import * as express from "express";
import { Tag } from "../../Models/Tag";
import { v4 as uuidv4 } from "uuid";
import { getTagsTable } from "../database";
import { createAPIResponseString } from "../../Models/ApiResponse";

const createTag = async (tag: Tag) => {
	tag.id = uuidv4();
	return await getTagsTable().doc(tag.id).set(tag);
};

const readAllTags = async (): Promise<Tag[]> => {
	const tags: Tag[] = [];
	const tagsRef = getTagsTable();
	const snapshot = await tagsRef.get();
	snapshot.forEach((doc) => {
		tags.push(doc.data() as Tag);
	});
	return tags;
};

const updateTag = async (tag: Tag) => {
	return await getTagsTable().doc(tag.id).set(tag);
};

const deleteTag = async (id: string) => {
	return await getTagsTable().doc(id).delete();
};

export const setupTagRoutes = (app: express.Application): void => {
	app.get("/tag/all", (_: express.Request, res: express.Response) => {
		readAllTags()
			.then((tags: Tag[]) => {
				res.send(createAPIResponseString(tags, 200));
			})
			.catch((err) => {
				console.log(err);
				res.send(createAPIResponseString("Failed to get tags", 500));
			});
	});
	app.post("/admin/tag", (req: express.Request, res: express.Response) => {
		const tag = req.body as Tag;
		if (tag.name.length === 0) {
			res.send(createAPIResponseString("You must include a title", 500));
		} else {
			createTag(tag)
				.then(() => {
					res.send(createAPIResponseString(true, 200));
				})
				.catch(() => {
					res.send(
						createAPIResponseString("Failed to create tag", 500)
					);
				});
		}
	});

	app.put("/admin/tag/:id", (req: express.Request, res: express.Response) => {
		const tag = req.body as Tag;
		if (tag.name.length === 0) {
			res.send(createAPIResponseString("You must include a title", 500));
		} else {
			updateTag(tag)
				.then(() => {
					res.send(createAPIResponseString(true, 200));
				})
				.catch(() => {
					res.send(
						createAPIResponseString("Failed to update tag", 500)
					);
				});
		}
	});

	app.delete(
		"/admin/tag/:id",
		(req: express.Request, res: express.Response) => {
			const id = req.params.id;
			deleteTag(id)
				.then(() => {
					res.send(createAPIResponseString(true, 200));
				})
				.catch(() => {
					res.send(
						createAPIResponseString("Failed to delete tag", 500)
					);
				});
		}
	);
};
