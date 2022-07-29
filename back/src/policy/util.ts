import { v4 } from "uuid";
import { ApiResponse } from "../common/api-response";
import { $_, keys, ParameterizedMessage } from "../common/server-i18n";
import { Relationship, Thing } from "../common/core";
import { KnownType } from "../common/known-types";
import { InsertableRelationship, InsertPayload } from "../common/inserting";

export function dereference(body: InsertPayload): ApiResponse<{
	things: Thing<KnownType>[],
	relationships: Relationship<KnownType,KnownType,KnownType>[],
}> {
	// validate that each reference is unique
	const seenRefs = new Set<string>();
	let errors: ParameterizedMessage[] = [];
	for (const thing of body.things ?? []) {
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
	const things: Thing<KnownType>[] = [];
	let relationships: InsertableRelationship[] | Relationship<KnownType,KnownType,KnownType>[] = body.relationships ?? [];
	for (const thing of body.things ?? []) {
		if ("idRef" in thing) {
			const newThing: Thing<KnownType> = {
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
			things.push(newThing);
		} else {
			things.push(thing);
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
		value: {
			things,
			relationships: relationships as Relationship<KnownType, KnownType, KnownType>[],
		},
	};
}