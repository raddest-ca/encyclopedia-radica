import { App } from "../app";
import { ThingQuery } from "../data/store";
import { Thing } from "../models/core";

export default function(app: App) {
    app.express.post("/things", (req, res) => {
        const query: ThingQuery = req.body;
        
		let pred: (t: Thing) => boolean = _ => true;
		if (query.filter.type?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.type.id === query.filter.type!.id;
		}
		if (query.filter.type?.version !== undefined) {
			const old = pred;
			pred = x => old(x) && x.type.version === query.filter.type!.version;
		}
		const rtn = app.store.things.filter(pred);
		res.json({
			values: query.countOnly ? [] : rtn,
			count: rtn.length,
			countOnly: query.countOnly ?? false,
		});
    });
}