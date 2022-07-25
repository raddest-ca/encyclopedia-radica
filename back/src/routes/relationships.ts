import { App } from "../app";
import { RelationshipQuery } from "../data/store";

export default function(app: App) {
    app.express.post("/relationships", async (req, res) => {
        const query = req.body as RelationshipQuery<any, any, any>;
        const results = await app.store.getRelationships(query);
		res.json(results);
    });
}