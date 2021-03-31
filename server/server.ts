import express from "express";
import { mappings } from "./pages/server_mapping.json";
import path from "path";
import { setupProjectRoutes } from "./project";
import { setupCommentRoutes } from "./comment";
import { setupAdminRoutes } from "./admin/admin";
import { setupUserAuthRoutes } from "./user";
const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/scripts/main.js", (req: express.Request, res: express.Response) =>
	res.sendFile(path.join(__dirname, "..", "dist/main.js"))
);
app.get("/scripts/vendor.js", (req: express.Request, res: express.Response) =>
	res.sendFile(path.join(__dirname, "..", "dist/vendor.js"))
);

setupAdminRoutes(app);
setupUserAuthRoutes(app);
setupProjectRoutes(app);
setupCommentRoutes(app);
mappings.forEach((mapping) => {
	// this will look at server_mappings.json and bind each route to a .html page
	app.get(mapping.path, (req: express.Request, res: express.Response) =>
		res.sendFile(path.join(__dirname, "pages", `${mapping.file}`))
	);
});

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
