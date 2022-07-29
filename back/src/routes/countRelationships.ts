import { App } from "../app";
import { RelationshipQuery } from "../common/querying";

export default function (app: App) {
	app.express.post("/countRelationships", async (req, res) => {
		const query = req.body as RelationshipQuery<any, any, any>;
		const results = await app.store.countRelationships(query);
		res.json(results);
	});
}
