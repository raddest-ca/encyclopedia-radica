import { v4 } from "uuid";
import { App } from "../app";
import { ApiResponse } from "../common/apiResponse";
import { $_, keys, ParameterizedMessage } from "../common/i18n";
import { Either, Relationship, Thing } from "../models/core";
import { process as processPolicy } from "../policy/insertPolicy";

export type InsertableThing = Thing<any> | {
	idRef: string;
	type: string;
}; 
export type InsertableRelationship = Relationship<any,any,any> | {
	type: string;
	left: InsertableThing;
	right: InsertableThing;
};

export interface InsertPayload {
	things?: InsertableThing[];
	relationships?: InsertableRelationship[];
}

function dereference(body: Required<InsertPayload>): ApiResponse<Either[]> {
	// validate that each reference is unique
	const seenRefs = new Set<string>();
	let errors: ParameterizedMessage[] = [];
	for (const thing of body.things) {
		if ("idRef" in thing) {
			if (seenRefs.has(thing.idRef)) {
				errors.push($_(keys.policy_duplicate_id_reference, thing.idRef, thing.type));
			}
		}
	}
	if (errors.length > 0) {
		return {
			success: false,
			errors,
		};
	}

	// replace references by assigning IDs and updating relationships
	let result: Either[] = [];
	let relationships = body.relationships;
	for (const thing of body.things) {
		if ("idRef" in thing) {
			const newThing: Thing<any> = {
				type: thing.type,
				id: v4(),
			};
			relationships = relationships.map(rel => {
				if ("idRef" in rel.left) {
					return {
						left: {
							id: newThing.id,
							type: rel.left.type,
						},
						type: rel.type,
						right: rel.right,
					};
				}
				if ("idRef" in rel.right) {
					return {
						left: rel.left,
						type: rel.type,
						right: {
							id: newThing.id,
							type: rel.right.type,
						},
					};
				} else {
					return rel;
				}
			});
			result.push(newThing);
		} else {
			result.push(thing);
		}
	}

	// Validate all relationships have resolved IDs
	for (const rel of relationships) {
		if ("idRef" in rel.left) {
			errors.push($_(keys.policy_unresolved_id_reference, rel.left.type, rel.type, rel.right.type, rel.left.idRef));
		}
		if ("idRef" in rel.right) {
			errors.push($_(keys.policy_unresolved_id_reference, rel.left.type, rel.type, rel.right.type, rel.right.idRef));
		}
	}
	if (errors.length > 0) {
		return {
			success: false,
			errors,
		};
	}

	// Return results
	return {
		success: true,
		value: result,
	};
}

export function process(app: App) {
	app.express.post("/insert", async (req, res) => {
		const payload = req.body as InsertPayload;
		try {
			const policyResult = processPolicy(payload);
			if (policyResult.success) {
				const deref = dereference(policyResult.value);
				if (deref.success) {
					app.store.addAll(...deref.value);
					res.json(deref);
				} else {
					res.status(400);
					res.json(deref);
				}
			} else {
				res.status(400);
				res.json(policyResult)
			}
		} catch (e) {
			res.sendStatus(500);
		}
	});
}

