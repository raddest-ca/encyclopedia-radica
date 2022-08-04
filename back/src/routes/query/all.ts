import { App } from "../../app";

export default function (app: App) {
	app.express.get("/query/all", async (req, res) => {
		res.json(app.store);
	});
}
