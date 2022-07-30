import { App } from "../../app";
import { ThingQuery } from "../../common/querying";

export default function (app: App) {
	app.express.post("/countThings", async (req, res) => {
		const query = req.body as ThingQuery<any>;
		const results = await app.store.countThings(query);
		res.json(results);
	});
}
