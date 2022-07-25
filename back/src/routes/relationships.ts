import { App } from "../app";
import { RelationshipQuery } from "../data/store";
import { Relationship } from "../models/core";
import { KnownType } from "../models/known-types";

export default function(app: App) {
    app.express.post("/rels", async (req, res) => {
        const query = req.body as RelationshipQuery<any, any, any>;
        const results = await app.store.getRelationships(query);
		res.json(results);
    });
}