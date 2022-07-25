import { App } from "../app";
import { RelationshipQuery } from "../data/store";
import { Relationship } from "../models/core";

export default function(app: App) {
    app.express.post("/rels", (req, res) => {
        const query = req.body as RelationshipQuery;
        
		let pred: (t: Relationship) => boolean = _ => true;
		if (query.filter.type?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.type.id === query.filter.type!.id;
		}
		if (query.filter.type?.version !== undefined) {
			const old = pred;
			pred = x => old(x) && x.type.version === query.filter.type!.version;
		}
		if (query.filter.left?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.left.id === query.filter.left?.id;
		}
		if (query.filter.left?.type?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.left.type?.id === query.filter.left?.type?.id;
		}
		if (query.filter.left?.type?.version !== undefined) {
			const old = pred;
			pred = x => old(x) && x.left.type?.version === query.filter.left?.type?.version;
		}
		if (query.filter.right?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.right.id === query.filter.right?.id;
		}
		if (query.filter.right?.type?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.right.type?.id === query.filter.right?.type?.id;
		}
		if (query.filter.right?.type?.version !== undefined) {
			const old = pred;
			pred = x => old(x) && x.right.type?.version === query.filter.right?.type?.version;
		}
		const rtn = app.store.relationships.filter(pred);
        res.json({
			values: query.countOnly ? [] : rtn,
			count: rtn.length,
			countOnly: query.countOnly ?? false,
		});
    });
}