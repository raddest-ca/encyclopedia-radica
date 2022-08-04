import { App } from "../../app";
import { ThingQuery } from "../../common/querying";

export default function (app: App) {
	app.express.post("/query/things", async (req, res) => {
		const query = req.body as ThingQuery<any>;
		const results = await app.store.getThings(query);
		res.json(results);
	});
}
