import { App } from "../../app";
import { RelationshipQuery } from "../../common/querying";

export default function (app: App) {
	app.express.post("/query/relationships", async (req, res) => {
		const query = req.body as RelationshipQuery<any, any, any>;
		const results = await app.store.getRelationships(query);
		res.json(results);
	});
}
