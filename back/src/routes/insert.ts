import { App } from "../app";
import { Relationship, Thing } from "../common/core";
import { KnownType } from "../models/known-types";
import { process as processPolicy } from "../policy/insert-policy";

export type InsertableThing = Thing<KnownType> | {
	idRef: string;
	type: KnownType;
}; 
export type InsertableRelationship = Relationship<KnownType,KnownType,KnownType> | {
	type: KnownType;
	left: InsertableThing;
	right: InsertableThing;
};

export interface InsertPayload {
	things?: InsertableThing[];
	relationships?: InsertableRelationship[];
}

export function process(app: App) {
	app.express.post("/insert", async (req, res) => {
		const payload = req.body as InsertPayload;
		try {
			const policyResult = await processPolicy(app, payload);
			if (policyResult.success) {
				app.store.addAll(...policyResult.value.things);
				app.store.addAll(...policyResult.value.relationships);
				res.json(policyResult);
			} else {
				res.status(400);
				res.json(policyResult)
			}
		} catch (e) {
			res.sendStatus(500);
		}
	});
}

