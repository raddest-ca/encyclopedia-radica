import type { Relationship, Thing} from "./core";
import type { DeepPartial } from "tsdef"
export interface ThingQuery {
	filter: DeepPartial<Thing>;
	countOnly?: boolean;
}
export interface RelationshipQuery {
	filter: DeepPartial<Relationship>;
	countOnly?: boolean;
}


export async function getThings(body: ThingQuery) {
	const req = await fetch("http://localhost:8080/things", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
			body,
		}),
	});
    return await req.json() as {
		values?: Thing[];
		count: number;
	};
}
export type ThingResults = Awaited<ReturnType<typeof getThings>>;

export async function getRelationships(body: RelationshipQuery) {
	const req = await fetch("http://localhost:8080/rels", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
			body,
		}),
	});
    return await req.json() as {
		values?: Thing[];
		count: number;
	};
}

export type RelationshipResults = Awaited<ReturnType<typeof getRelationships>>;

